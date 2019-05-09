import { queryAddProject, queryJmeterList, querySetProjectStatus } from '@/services/api';
import { routerRedux } from 'dva/router';
import { reloadAuthorized } from '@/utils/Authorized';
import { message } from 'antd';

export default {
  namespace: 'jmeter',
  state: {
    jmterList: [],
  },

  effects: {
    *queryAddProject({ payload }, { call, put }) {
      const response = yield call(queryAddProject, payload);
      if (response) {
        switch (response.code) {
          case 0:
            message.success('添加成功');
            break;
          case 10001:
            message.warning(response.msg);
            break;
          case 10002:
            message.warning(response.msg);
            break;
          case 99999:
            reloadAuthorized();
            message.error(response.msg);
            yield put(routerRedux.push('/user/login'));
            break;
          default:
            message.warning('出现了什么鬼');
        }
      } else {
        message.error('服务器异常！');
      }
    },
    *querySetProjectStatus({ payload }, { call, put }) {
      const response = yield call(querySetProjectStatus, payload);
      if (response) {
        switch (response.code) {
          case 0:
            message.success('设置成功');
            break;
          case 10001:
            message.warning(response.msg);
            break;
          case 10002:
            message.warning(response.msg);
            break;
          case 99999:
            reloadAuthorized();
            message.error(response.msg);
            yield put(routerRedux.push('/user/login'));
            break;
          default:
            message.warning('出现了什么鬼');
        }
      } else {
        message.error('服务器异常！');
      }
    },
    *queryJmeterList({ payload }, { call, put }) {
      yield put({ type: 'updateState', payload: { jmterList: null } });
      const response = yield call(queryJmeterList, payload);
      if (response) {
        switch (response.code) {
          case 0:
            yield put({ type: 'updateState', payload: { jmterList: response.content } });
            break;
          case 10001:
            message.warning(response.msg);
            break;
          case 10002:
            message.warning(response.msg);
            break;
          case 99999:
            reloadAuthorized();
            message.error(response.msg);
            yield put(routerRedux.push('/user/login'));
            break;
          default:
            message.warning('出现了什么鬼');
        }
      } else {
        message.error('服务器异常！');
      }
    },
  },

  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
