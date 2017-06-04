
import { expect } from 'chai';
import 'mocha';

import CmpxLib from '../CmpxLib';

describe('Cmpx', () => {
  it('inArray', () => {
    var index = CmpxLib.inArray([1,2], 1);
    expect(index).to.equal(0);
    index = CmpxLib.inArray([1,2], 2);
    expect(index).to.equal(1);

    var obj = {}
    index = CmpxLib.inArray([1,2], function(item:any, index:number){
      expect(obj === this).to.equal(true);
      return item == 2;
    }, obj);
    expect(index).to.equal(1);

    index = CmpxLib.inArray([1,2], function(item:any, index:number){
      expect(obj != this).to.equal(true);
      return item == 2;
    });
  });
});