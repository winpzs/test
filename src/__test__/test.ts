
import { expect } from 'chai';
import 'mocha';

import cmpx from '../cmpx';

describe('cmpx', () => {
  it('inArray', () => {
    var index = cmpx.inArray([1,2], 1);
    expect(index).to.equal(0);
    index = cmpx.inArray([1,2], 2);
    expect(index).to.equal(1);

    var obj = {}
    index = cmpx.inArray([1,2], function(item:any, index:number){
      expect(obj === this).to.equal(true);
      return item == 2;
    }, obj);
    expect(index).to.equal(1);

    index = cmpx.inArray([1,2], function(item:any, index:number){
      expect(obj != this).to.equal(true);
      return item == 2;
    });
  });
});