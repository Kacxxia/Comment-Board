
export const DEFAULT_AVATAR = "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50"
export const GRAVATAR_BASE = "https://www.gravatar.com/avatar/"
export function isFunction(func) {
    return Object.prototype.toString.call(func) === "[object Function]"
}

export function isObject(obj) {
    return Object.getPrototypeOf(obj) === Object.prototype
}

export function throttle(func, wait, options) {
    return debounce(func, wait, {
        maxWait: wait,
        leading: "leading" in options ? options.leading : true,
        trailing: "trailing" in options ? options.trailing : true
    })
}

export function debounce(func, wait, options) {
    var lastArgs,
        lastThis,
        maxWait,
        result,
        timerId,
        lastCallTime,
        lastInvokeTime = 0,
        leading = false,
        maxing = false,
        trailing = true;

    if (isObject(options)) {
      leading = !!options.leading;
      maxing = 'maxWait' in options;
      maxWait = maxing ? Math.max(options.maxWait , wait) : maxWait;
      trailing = 'trailing' in options ? !!options.trailing : trailing;
    }

    function invokeFunc(time) {
      var args = lastArgs,
          thisArg = lastThis;

      lastArgs = lastThis = undefined;
      lastInvokeTime = time;
      result = func.apply(thisArg, args);
      return result;
    }

    function leadingEdge(time) {
      lastInvokeTime = time;
      timerId = setTimeout(timerExpired, wait);
      return leading ? invokeFunc(time) : result;
    }

    function remainingWait(time) {
      var timeSinceLastCall = time - lastCallTime,
          timeSinceLastInvoke = time - lastInvokeTime,
          timeWaiting = wait - timeSinceLastCall;

      return maxing
        ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
        : timeWaiting;
    }

    function shouldInvoke(time) {
      var timeSinceLastCall = time - lastCallTime,
          timeSinceLastInvoke = time - lastInvokeTime;

      return (lastCallTime === undefined || (timeSinceLastCall >= wait) || (maxing && timeSinceLastInvoke >= maxWait));
    }

    function timerExpired() {
      var time = new Date().getTime();
      if (shouldInvoke(time)) {
        return trailingEdge(time);
      }
      timerId = setTimeout(timerExpired, remainingWait(time));
    }

    function trailingEdge(time) {
      timerId = undefined;

      if (trailing && lastArgs) {
        return invokeFunc(time);
      }
      lastArgs = lastThis = undefined;
      return result;
    }

    function debounced() {
      var time = new Date().getTime(),
          isInvoking = shouldInvoke(time);

      lastArgs = arguments;
      lastThis = this;
      lastCallTime = time;

      if (isInvoking) {
        if (timerId === undefined) {
          return leadingEdge(lastCallTime);
        }
        if (maxing) {
          timerId = setTimeout(timerExpired, wait);
          return invokeFunc(lastCallTime);
        }
      }
      if (timerId === undefined) {
        timerId = setTimeout(timerExpired, wait);
      }
      return result;
    }
    return debounced;
  }


  export const validEmailPattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*)@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)/i
  
  export function xssEscape(content) {
    const filter = [/&/g,  /</g, />/g,   /"/g,    /'/g,    /\//g]
    const safe = ["&amp", "&lt", "&gt", "&quot", "&#x27", "&#x2F"]
    return filter.reduce((acc, target, i) => {
      return acc.replace(target, safe[i])
    }, content)
  }

  export function onEnterWrapper(func) {
    return (event) => {
      if (event.key === 'Enter') func(event)
    }
  }

  export function flatArray(array) {
    return array.reduce((acc, t) => acc.concat(t), [])
  }