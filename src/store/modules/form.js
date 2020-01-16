const DEFAULT_STATE = { rootIndex: undefined, template: {}, submitData: {}, mappings: {}, elements: {}, data: {}, status: {}, index: undefined };
const ELEMENT_NOT_FOUND = "ELEMENT_NOT_FOUND";
const ELEMENT_INVALID = "ELEMENT_INVALID";
const PARENT_INVALID = "PARENT_INVALID";
const PARENT_REPEAT = "PARENT_REPEAT";
const TYPES = ["string"];

function isArrayEmpty(arr) {
  return arr === undefined || arr.length <= 0;
}

function isStringEmpty(str) {
  return str === undefined || str.length <= 0;
}

function updateStatusByParent(status, state, key) {

  if (status[key] !== undefined)
    return status[key];

  const element = state.elements[key];
  let res = true;
  // 未知元素错误
  if (!element)
    res = ELEMENT_NOT_FOUND;

  if (res === true && element.item && state.data[key] === undefined) {
    res = ELEMENT_INVALID;
  }

  if (res === true && element.parent) {
    res = updateStatusByParent(status, state, element.parent) === true ? true : PARENT_INVALID;
  }

  return status[key] = res;
}

function updateStatusByChild(status, state, key, parentStatus) {

  if (parentStatus !== undefined && status[key] !== undefined)
    return;

  let key_status = parentStatus !== true && parentStatus !== undefined ? PARENT_INVALID : undefined;
  const element = state.elements[key];
  if (key_status === undefined) {
    if (!element)
      key_status = ELEMENT_NOT_FOUND;
    else if (element.item && state.data[key] === undefined)
      key_status = ELEMENT_INVALID;
    else
      key_status = true;
  }
  status[key] = key_status;

  if (element.child) {
    for (let _child of element.child) {
      updateStatusByChild(status, state, _child, key_status);
    }
  }
}

function template_transform(mappings, schema, key, node, parent) {

  let _key = key++;
  schema[_key] = { ...node, parent, children: undefined };
  if (!isStringEmpty(node.id))
    mappings[node.id] = [...(mappings[node.id] || []), _key];
  if (!isArrayEmpty(node.children)) {
    schema[_key].child = [];
    for (let child of node.children) {
      key = template_transform(mappings, schema, key, child, _key);
    }
  }

  if (parent) {
    schema[parent].child.push(_key);
  }

  return key;
}

function buildBySubmitData(index, data, status, mappings, elements, submitData, dataNode, ignores, parent) {
  const { id, value, children } = dataNode;
  let _index = index;

  let key;
  for (let _key of mappings[id]) {

    if (elements[_key].parent !== parent)
      continue;

    key = _key;
    if (ignores[key] === undefined)
      break;
  }

  if (ignores[key] !== undefined) {
    elements[_index] = { ...elements[key], child: [] };
    if (parent !== undefined)
      elements[parent].child = [...elements[parent].child, _index];
    key = _index++;
    mappings[id].push(key);
  }
  submitData[key] = dataNode;
  ignores[key] = true;
  if (elements[key].item === true || TYPES.includes(elements[key].type)) {
    data[key] = { id };
    if (value !== undefined)
      data[key].value = value;
    status[key] = true;
  }

  if (!isArrayEmpty(children)) {
    for (let child of children) {
      _index = buildBySubmitData(_index, data, status, mappings, elements, submitData, child, ignores, key);
    }
  }

  return _index;
}


function build_parent(key, data, elements, submitData, child) {
  let children = child !== undefined && submitData[child] !== undefined ? [submitData[child]] : undefined;
  const _submitData = submitData[key] || {};
  _submitData.children = _submitData.children || [];
  if (children !== undefined) {
    _submitData.children = children.concat(_submitData.children);
  }

  if (submitData[key] !== undefined)
    return;

  const { id } = elements[key];
  if (data[key] === undefined) {
    _submitData.id = id;
  } else {
    const keys = Object.keys(data[key]);
    for (let _key of keys) {
      if (_key === 'children') {
        _submitData[_key] = data[key][_key].contact(_submitData[_key]);
      } else
        _submitData[_key] = data[key][_key];
    }
  }

  if (_submitData.children.length <= 0)
    delete _submitData.children;
  submitData[key] = _submitData;

  if (elements[key].parent !== undefined) {
    build_parent(elements[key].parent, data, elements, submitData, key);
  }
}

export const namespaced = true;

export const state = JSON.parse(JSON.stringify(DEFAULT_STATE));

export const mutations = {
  init(state, payload) {
    const _payload = { ...DEFAULT_STATE, ...payload };
    state.elements = _payload.elements;
    state.data = _payload.data;
    state.status = _payload.status;
    state.mappings = _payload.mappings;
    state.rootIndex = _payload.rootIndex;
    state.index = _payload.index;
    state.template = _payload.template;
    state.submitData = _payload.submitData;
  },
  setSubmitData(state, { submitData }) {
    state.submitData = submitData;
  },
  updateData(state, { data }) {
    state.data = { ...state.data, ...data };
  },
  updateStatus(state, { status }) {
    state.status = { ...state.status, ...status };
  },
  checkDataByKeys(state, { keys }) {
    const status = {};
    for (let key of keys) {
      if (state.data[key] !== undefined)
        updateStatusByParent(status, state, key);
      updateStatusByChild(status, state, key);
    }

    state.status = { ...state.status, ...status };
  }
};

export const actions = {
  init(ctx, payload) {
    ctx.commit('init', payload);
  },
  updateData(ctx, { data }) {
    ctx.commit('updateData', { data });
  },
  updateStatus(ctx, { status }) {
    ctx.commit('updateStatus', { status });
  },
  changeData(ctx, { data }) {
    ctx.commit('updateData', { data });
    ctx.commit('checkDataByKeys', { keys: Object.keys(data) });
  },
  changeByTemplate(ctx) {
    const elements = {};
    const mappings = {};
    const { rootIndex, template } = ctx.state;
    const index = template_transform(mappings, elements, rootIndex, template);
    ctx.commit('init', { elements, mappings, index, template });
  },
  changeByTemplateAndSubmit(ctx) {
    const ignores = {};
    const elements = {};
    const mappings = {};
    const status = {};
    const { rootIndex, template, submitData } = ctx.state;
    let index = template_transform(mappings, elements, rootIndex, template);
    const data = {};
    index = buildBySubmitData(index, data, status, mappings, elements, submitData, submitData[rootIndex], ignores);
    ctx.commit('init', { elements, mappings, index, template, data, submitData, status });
  },
  changeSubmitDataByData(ctx) {
    const data = ctx.state.data;
    const status = ctx.state.status;
    const elements = ctx.state.elements;

    const submitData = {};
    for (let prop in status) {
      if (status[prop] === true && data[prop] !== undefined) {
        build_parent(prop, data, elements, submitData);
      }
    }

    ctx.commit('setSubmitData', { submitData });
  }
};
