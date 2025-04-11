import {expect, test} from 'vitest'
import { addNumbers } from './sum'

test('addnumbers', ()=>{
  expect(addNumbers(1,2)).toBe(3);
})
