import { Request, Response } from 'express';

const model = {
  name: 'parenttable',
  title: '测试主表',
  autoload: true,
  commands: [
    { command: 'add', name: '新增' },
    { command: 'edit', name: '编辑', isselectrow: true },
    { command: 'remove', name: '删除', isselectrow: true, selectmultiple: true },
    { command: 'import', name: '导入' },
    { command: 'export', name: '导出' },
  ],
  fields: [
    { iskey: true, name: 'id', visible: false, issearch: false },
    { field: 'test1', title: 'TEST1' },
    { field: 'test2', title: 'TEST2' },
    { field: 'test3', title: 'TEST3', type: 'int', length: 150 },
  ],
  childmodels: [
    {
      name: 'childtable',
      title: '测试子表',
      isadd: true,
      isedit: true,
      isremove: true,
      isselect: true,
      ischeck: true,
      visible: true,
      fields: [
        { field: 'test4', title: 'TEST4' },
        { field: 'test5', title: 'TEST5' },
        { field: 'test6', title: 'TEST6' },
      ],
    },
  ],
};
const result = (data: any) => {
  return {
    success: true,
    data: data,
  };
};
export default {
  'POST /api/childtable/view': (req: Request, res: Response) => {
    res.send(result(model));
  },
  'POST /api/childtable/search': (req: Request, res: Response) => {
    res.send(result({ rows: [], total: 50 }));
  },
};
