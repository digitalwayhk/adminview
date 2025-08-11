import { SearchItem } from '@/components/WayPlus/way';
import { Request, Response } from 'express';
import { Item } from 'rc-menu';
const fields = [
  { iskey: true, name: 'id', visible: false, issearch: false },
  { field: 'code', title: '编码', visible: true },
  { field: 'name', title: '名称', visible: true },
  { field: 'age', title: '年龄', type: 'int', length: 150 },
  {
    field: 'sex',
    title: '性别',
    type: 'int',
    comvtp: {
      isvtp: true,
      items: [
        [0, '男'],
        [1, '女'],
      ],
    },
  },
  { field: 'date', title: '出生日期', type: 'datetime' },
  { field: 'desc', title: '备注', isremark: true },
  {
    field: 'typename',
    title: '类型',
    type: 'int',
    foreign: {
      //外键关系多对一，多为当前主表，从one为关联表,从关联表查询出选择的数据对应到主表的字段
      isfkey: true,
      oneobjecttypename: 'com.way.entity.TestType',
      oneobjectname: 'TestType',
      oneobjectfield: 'TestTypeItem',
      oneobjectfieldkey: 'id', // 对应外键行中获取Value的字段
      onedisplayname: 'name', // 对应外键行中获取text的字段
      manyobjecttypename: 'com.way.entity.TestType123',
      manyobjectname: 'TestType123',
      manyobjectfield: 'typename',
      manyobjectfiledkey: 'typename',
      manydisplayfield: 'name',
    },
  },
];
const model = {
  name: 'onetable',
  title: '测试单表',
  autoload: true,
  commands: [
    { command: 'add', name: '新增' },
    { command: 'edit', name: '编辑', isselectrow: true },
    { command: 'remove', name: '删除', isselectrow: true, selectmultiple: true },
  ],
  fields: fields,
};

const result = (data: any, msg: string) => {
  return {
    code: 200,
    success: true,
    data: data,
    message: msg,
  };
};
const testdata = (count: number) => {
  const rows = [];
  for (let i = 0; i < count; i++) {
    let obj = {
      id: i + 1,
      code: 'C00' + i + 1,
      name: 'TEST00' + i,
      age: i + 10,
      sex: i % 2 == 0 ? 0 : 1,
      date: '1980-3-4',
    };
    rows[i] = obj;
  }
  return rows;
};
const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};
let tempData: any[] = [];
export default {
  // 支持值为 Object 和 Array
  'POST /api/onetable/view': (req: Request, res: Response) => {
    res.send(result(model));
  },
  'POST /api/onetable/search': async (req: Request, res: Response) => {
    //console.log(tempData);
    //await waitTime(2000);
    if (tempData.length == 0) {
      tempData = testdata(0);
    }
    const w: SearchItem = req.body;
    if (w.field != undefined && w.foreign != undefined) {
      res.send(result({ rows: testdata(5), total: 5, model: model }));
      return;
    }
    if (w.parent != undefined && w.childmodel != undefined) {
    }
    if (w != undefined && w.whereList?.length > 0) {
      const data = tempData.filter((value) => {
        return value[w.whereList[0].name] == w.whereList[0].value;
      });
      res.send(result({ rows: data, total: data.length }));
      return;
    }
    if (tempData.length > 0) {
      tempData.forEach((value) => {
        if (value.typename > 0) {
          const tds = testdata(value.typename);
          value['TestTypeItem'] = tds[tds.length - 1];
        }
      });
    }
    res.send(result({ rows: tempData, total: tempData.length }));
  },
  'POST /api/onetable/add': (req: Request, res: Response) => {
    //console.log(req.body);
    req.body.id = tempData.length + 1;
    tempData.unshift(req.body);
    const item = req.body;
    if (item.typename > 0) {
      const tds = testdata(item.typename);
      item['TestTypeItem'] = tds[tds.length - 1];
    }
    res.send(result(item));
  },
  'POST /api/onetable/edit': (req: Request, res: Response) => {
    //console.log(req.body);
    const item = tempData.find((data) => {
      return data.id == req.body.id;
    });
    for (const n in req.body) {
      if (req.body[n] != undefined && req.body[n] != item[n]) {
        item[n] = req.body[n];
      }
    }
    res.send(result(item));
  },
  'POST /api/onetable/remove': (req: Request, res: Response) => {
    console.log(req.body);
    function removeRow(id) {
      const index = tempData.findIndex((value) => {
        return value.id == id;
      });
      if (index > 0) {
        tempData.splice(index, 1);
        return index;
      } else {
        return -1;
      }
    }
    const isarr = Array.isArray(req.body);
    if (isarr) {
      req.body.forEach((id) => {
        removeRow(id);
      });
      res.send(result(0));
    } else {
      const index = removeRow(req.body.id);
      if (index > 0) {
        res.send(result(index));
      } else {
        res.send(result(null, '未找到需要删除的数据！'));
      }
    }
  },
};
