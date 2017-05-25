
import { expect } from 'chai';
import 'mocha';

import Cmpx from '../Cmpx';

describe('Cmpx', () => {
  it('inArray', () => {
    var index = Cmpx.inArray([1,2], 1);
    expect(index).to.equal(0);
    index = Cmpx.inArray([1,2], 2);
    expect(index).to.equal(1);

    var obj = {}
    index = Cmpx.inArray([1,2], function(item:any, index:number){
      expect(obj === this).to.equal(true);
      return item == 2;
    }, obj);
    expect(index).to.equal(1);

    index = Cmpx.inArray([1,2], function(item:any, index:number){
      expect(obj != this).to.equal(true);
      return item == 2;
    });
  });
});