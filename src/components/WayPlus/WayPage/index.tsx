import React, { useEffect, useState } from 'react';
import { Col, message, Modal, Row } from 'antd';
import { connect } from 'react-redux';
import WayToolbar from '../WayToolbar';
import WayTable from '../WayTable';
import type { FormPlus } from '../WayForm';
import WayForm from '../WayForm';
import type {
  ChildModelAttribute,
  CommandAttribute,
  ModelAttribute,
  SearchItem,
  SearchWhere,
  TableData,
} from '../way';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { CloseCircleOutlined, CommentOutlined } from '@ant-design/icons';
import { isArray } from 'lodash';
import ImportForm from '../WayTable/importform';
import { pageExportExcel } from '../WayTable/exportform';

interface WayPageProps {
  namespace?: string;
  controller: string;
  title?: string;
  service?: string;
  onCommandClick?: (command: string) => void;
  onExpandedRowTabPane?: (childmodel: ChildModelAttribute, record: any) => JSX.Element;
}
const WayPage: React.FC<WayPageProps> = (props) => {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState(null);
  const [selectCount, setSelectCount] = useState(0);
  const [keys, setKeys] = useState([]);
  const [model, setModel] = useState<ModelAttribute | undefined>(undefined);
  const [data, setData] = useState({ rows: [], total: 0 });
  const [importShow, setImportShow] = useState(false);
  const [form, setForm] = useState<FormPlus>(null);
  const [searchItem, setSearchItem] = useState<SearchItem>({
    page: 1,
    size: 10,
    whereList: [],
    sortList: [],
  });
  const [current, setCurrent] = useState(1);
  useEffect(() => {
    setModel(undefined);
    setValues(null);
    setSearchItem({
      page: 1,
      size: 10,
      whereList: [],
      sortList: [],
    })
    setSelectCount(0);
    setKeys([]);
    setData({ rows: [], total: 0 });
    view();
  }, [props.controller]);

  if (model == undefined) {
    return <></>;
  }

  function view() {
    console.log('waypage.init');
    console.log(props);
    if (!props.init) {
      const modelname = props.namespace ?? props.controller;
      console.log(modelname + 'model 未创建或init方法未实现，不能初始化page.');
      return;
    }
    props.init().then((result) => {
      if (result == undefined) return;
      if (result.success) {
        setModel(result.data);
        if (result.data.autoload) {
          searchDataThan({}, (data) => {
            setData(data);
          });
        }
      } else {
        resultMessage(result.message);
      }
    });
  }

  function searchDataThan(item: SearchItem, callback: (data: TableData) => void) {
    setSelectCount(0);
    setLoading(true);
    props.search(item).then((result) => {
      if (result == null) return;
      setLoading(false);
      if (result != undefined && result.success) {
        if (result.data == undefined) {
          result.data = { rows: [], total: 0 };
        }
        if (result.data.rows == null) result.data.rows = [];
        if (item.foreign == undefined && item.childmodel == undefined) {
          if (keys.length > 0) {
            const row = result.data.rows.find((row) => {
              return row["id"] == keys[0]
            })
            if (row != undefined) {
              setKeys(keys)
              setSelectCount(keys.length);
              setValues(row);
            } else {
              setKeys([])
              setSelectCount(0);
              setValues(null);
            }
          }
        }
        if (callback) callback(result.data);
        else {
          setData(result.data);
        }
      } else {
        resultMessage(result.message);
      }
    }, (error) => {
      console.log(error);
      setLoading(false);
    });
  }

  const executeCommand = (command: CommandAttribute) => {
    let item = null;
    if (command.isselectrow) item = values;
    if (command.selectmultiple) item = keys;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    executeCommandData(command, item);
  };
  const executeCommandData = (command: CommandAttribute, values: any) => {
    setLoading(true);
    props.execute(command.command, values).then((result) => {
      console.log(result);
      if (result != undefined && result.success) {
        setLoading(false);
        message.success(command.name + '完成');
        if (model?.viewtype != 'form') {
          if (form) {
            form.hide();
          }
          searchDataThan(searchItem, (data) => {
            setData(data);
          });
        }
      } else {
        setLoading(false);
        resultMessage(result.message);
      }
    }, (error) => {
      console.log(error);
      setLoading(false);
    });
  };
  function isObject(obj) {
    return typeof obj === 'object' && obj !== null;
  }
  function resultMessage(message: any) {
    console.log(message);
    let msg = message?.data?.errorMessage;
    if (msg == undefined) {
      if (isObject(message) && message.message) {
        msg = message.message;
      }
      if (message.response && message.response.errorMessage) {
        msg = message.response.errorMessage;
      }
      if (message.response && message.response.message) {
        msg = message.response.message;
      }
    }
    Modal.error({
      visible: true,
      title: '出错了',
      icon: <CloseCircleOutlined />,
      content: <div>{msg}</div>,
    });
  }
  function fromshow(command: CommandAttribute, row: any) {
    if (form != null) {
      form.clear();
    }
    form.setHideSearch(true);
    form.setTitle(model?.title + '-' + command.name);
    form.show();
    if (row) {
      form.setValues(row);
      form.setHideSearch(false);
    }
    // eslint-disable-next-line @typescript-eslint/no-shadow
    form.onFinish = (values: any) => {
      console.log(values);
      executeCommandData(command, values);
    };
  }
  function renderToolbar(issearch: boolean) {
    // 添加调试信息
    console.log('renderToolbar - model:', model);
    console.log('renderToolbar - data:', data);
    console.log('renderToolbar - selectCount:', selectCount);
    console.log('renderToolbar - values:', values);
    const serach = issearch
      ? {
        fields: model?.fields?.filter((f) => f.issearch ?? true),
        onSearch: (w: SearchWhere) => {
          setLoading(true);
          let item = { page: 1, whereList: [] };
          if (w != undefined) {
            if (isArray(w)) {
              item.whereList = w;
            } else {
              item.whereList = [w];
            }
          }
          setSearchItem(item);
          setCurrent(1);
          searchDataThan(item, (data) => {
            setData(data);
          });
        },
        onSearchData: searchDataThan,
      }
      : false;
    try {
      return (
        <WayToolbar
          attrs={model?.commands}
          isselectrow={true}
          selectcount={selectCount}
          commandShow={true}
          isshow={!issearch}
          // helpShow={{ ishelp: true }} // isprint: true, isset: true,
          onClick={(name: string, command: CommandAttribute) => {
            console.log(name);
            if (name == 'ImportData' || name == 'importdata') {
              setImportShow(true);
              return;
            }
            if (name == 'ExportData' || name == 'exportdata') {
              pageExportExcel(model, data.total, searchItem, props.search, props.title + '.xlsx');
              return;
            }
            if (name == 'add') {
              if (model?.viewtype == 'form') {
                form.onFinish = (values: any) => {
                  console.log(values);
                  executeCommandData(command, values);
                };
                form.submit();
                return;
              }
              fromshow(command);
              return;
            }
            if (name == 'edit') {
              fromshow(command, values);
              return;
            }
            executeCommand(command);
          }}
          searchShow={serach}
        />
      );
    } catch (error) {
      console.error('renderToolbar error:', error);
      return <div>工具栏渲染错误</div>;
    }
  }
  function renderTable() {
    return (
      <WayTable
        attr={model}
        data={data}
        isselect={true}
        isexpandable={true}
        loading={loading}
        current={current}
        onSelectRows={(row, keys) => {
          console.log(row);
          console.log(keys);
          setKeys(keys);
          setSelectCount(keys.length);
          setValues(row);
        }}
        onSearchData={(item, callback) => {
          if (item.parent && item.childmodel) {
            //子表查询
            searchDataThan(item, (data) => {
              callback(data);
            });
            return;
          }
          setLoading(true);
          setCurrent(item.page);
          item.whereList = searchItem.whereList;
          setSearchItem(item);
          searchDataThan(item, (data) => {
            setData(data);
          });
        }}
        onExpandedRowTabPane={props.onExpandedRowTabPane}
        onRowDoubleClick={(event, record) => {
          // eslint-disable-next-line @typescript-eslint/no-shadow
          const cmd = model?.commands?.find((cmd) => {
            return cmd.command == 'edit' && cmd.visible;
          });
          if (cmd != undefined) {
            fromshow(cmd, record);
          }
        }}
      />
    );
  }
  function renderForm(ismodel: boolean) {
    return (
      <WayForm
        attr={model}
        title={props.title}
        ismodal={ismodel}
        onInitFormed={(f) => {
          setForm(f);
        }}
        onSearchData={searchDataThan}
      />
    );
  }
  function render() {
    if (model?.viewtype == 'form') {
      return renderViewForm();
    }
    return (
      <PageHeaderWrapper title={props.title}>
        <Row gutter={[16, 16]}>
          <Col span={24}>{renderToolbar(true)}</Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24}>{renderTable()}</Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24}>{renderForm(true)}</Col>
        </Row>
        <ImportForm
          title={props.title}
          isShow={importShow}
          attr={model}
          onAdd={props.execute}
          form={form}
          onShowChange={(show) => {
            setImportShow(show);
            if (!show) {
              searchDataThan(searchItem);
            }
          }}
          onSearchData={searchDataThan}
        />
      </PageHeaderWrapper>
    );
  }
  function renderViewForm() {
    return (
      <PageHeaderWrapper title={props.title}>
        <Row gutter={[16, 16]}>
          <Col span={24}>{renderToolbar(false)}</Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24}>{renderForm(false)}</Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
  return render();
};

function mapDispatchToProps(dispatch: any, ownProps: WayPageProps) {
  let typens = ownProps.controller;
  if (ownProps.namespace != undefined) typens = ownProps.namespace;
  const init = (args: any) => {
    return {
      type: typens + '/init',
      payload: args,
    };
  };
  const search = (args: any) => {
    return {
      type: typens + '/search',
      payload: args,
    };
  };
  const execute = (args: any) => {
    return {
      type: typens + '/execute',
      payload: args,
    };
  };
  return {
    dispatch,
    init() {
      return dispatch(
        init({
          c: ownProps.namespace + '/' + ownProps.service + '/' + ownProps.controller,
          s: ownProps.service,
        }),
      );
    },
    search(searchItem: SearchItem) {
      const c = ownProps.namespace + '/' + ownProps.service + '/' + ownProps.controller;
      return dispatch(search({ c: c, item: searchItem, s: ownProps.service }));
    },
    execute(command: string, item: any) {
      const c = ownProps.namespace + '/' + ownProps.service + '/' + ownProps.controller;
      return dispatch(execute({ c: c, command: command, item: item, s: ownProps.service }));
    },
  };
}
export default connect(() => { }, mapDispatchToProps)(WayPage);
