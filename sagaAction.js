
import { put, call, takeEvery, takeLatest } from 'redux-saga/effects';

export default function sagaAction(type, props, handler) {

  const ac = function(...values) {

    const action = props ? {} : values[0] ;

    if (props) {

      props.forEach((key, index) => action[key] = values[index])

    }

    return {
      ...action,
      type,
    }

  }

  const saga = function* (action) {

    try {

      yield put({type: `${type}.attempt`, action})

      const data = yield call(handler, action);

      yield put({type: `${type}.success`, action, data})

      return data;

    }
    catch(error) {

      yield put({type: `${type}.failure`, action, error})

    }

  }

  ac.type = type;
  ac.saga = saga;
  ac.ATTEMPT = `${type}.attempt`;
  ac.SUCCESS = `${type}.success`;
  ac.FAILURE = `${type}.failure`;

  ac.takeEvery = () => takeEvery(type, saga);
  ac.takeLatest = () => takeLatest(type, saga);

  return ac;

}

