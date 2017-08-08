import Vue from 'vue';

const chming = {
  install: (Vue, options) => {

    let toString = Array.prototype.toString;
    let slice = Array.prototype.slice;
    let forEach = Array.prototype.forEach;

    function type(data) {
      return toString.call(data).slice(8, -1).toLowerCase();
    }
    function isType(data, data_type) {
      validate(data_type, 'string', 'data_type 전달 인자는 문자열이 전달되어야 합니다');
      return type(data) === data_type;
    }
    function validate(data_type, compare_data_type, throw_message) {
      if( type(data_type) === compare_data_type ) {
        return true;
      } else {
        throw throw_message;
      }
    }
    Vue.isNumber = function(data) {
      return isType(data, 'number') && !Number.isNaN(data);
    };
    Vue.isString = function(data) {
      return isType(data, 'string');
    };
    Vue.isFunction = function(data) {
      return isType(data, 'function');
    };
    Vue.isArray = function(data) {
      return isType(data, 'array');
    };
    Vue.isObject = function(data) {
      return isType(data, 'object');
    };
    Vue.makeArray = function(obj) {
      if( !('length' in obj) ) {
        return [];
      }
      return slice.call(obj);
    };
    let forEachFn = function() {
      if(forEach) {
        return function(obj, callback) {
          obj.forEach(callback);
        };
      } else {
        return function(obj, callback) {
          for(var i = 0, l = obj.length; i < l; i++) {
            callback(obj[i], i, obj);
          }
        };
      }
    }();
    Vue.each = function(obj, callback) {
      // 전달된 obj의 유형 파악
      // callback 이 함수 유형인지 검증
      validate(callback, 'function', '두 번째 인자는 함수이어야 합니다.');

      // 1. 배열
      if(!this.isObject(obj) && obj.length) { obj = this.makeArray(obj); }
      this.isArray(obj) && forEachFn(obj, callback);

      // 2. 객체
      if(this.isObject(obj)) {
        for( var prop in obj ) {
          obj.hasOwnProperty(prop) && callback(prop, obj[prop], obj);
        }
      }
    };
  },
};

Vue.use(chming);