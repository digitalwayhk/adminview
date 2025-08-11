import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'realDark',
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixSiderbar: false,
  title: 'Admin View',
  pwa: false,
  logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  headerHeight: 48,
  splitMenus: false,
  fixedHeader: false,
  footerRender: false,
};

export default Settings;
