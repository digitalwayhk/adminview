import WayPage from '@/components/WayPlus/WayPage/index';

export default (props: any) => {
  console.log(props.match.params);
  return (
    <WayPage
      controller={props.match.params.c}
      service={props.match.params.s}
      namespace={'manage'}
    />
  );
};
