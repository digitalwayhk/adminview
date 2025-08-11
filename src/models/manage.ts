import { WayModel } from '@/components/WayPlus/waymodel';

const ManageModel = {
  namespace: 'manage',
  ...WayModel({
    // initing: async (args) => {
    //   args.payload = '/manage/wallets/' + args.payload;
    // },
    // searching: async (args) => {
    //   args.payload.c = '/manage/wallets/' + args.payload.c;
    // },
    // execing: async (args) => {
    //   args.payload.c = '/manage/wallets/' + args.payload.c;
    // },
  }),
};
export default ManageModel;
