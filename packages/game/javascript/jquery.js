"use strict";

import jQuery from "jquery";
import { injector } from "jsuice";

function provideJquery() {
  return jQuery;
}

export default injector.annotateProvider(provideJquery, injector.SINGLETON_SCOPE);
