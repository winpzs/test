
import { expect } from 'chai';
import 'mocha';

import {lib} from '../lib';

describe('Hello function', () => {
  it('should return hello world', () => {
    var index = lib.inArray([1,2], 1);
    expect(index).to.equal(0);
  });
});