import { PageHeaderWrapper } from '@ant-design/pro-layout';


export default (props: any) => {
    console.log(props.match.params);
    return (
        <PageHeaderWrapper title={props.title}>
         
        </PageHeaderWrapper>
      );
  };