import '@testing-library/jest-dom'
import { configure } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import toJson from 'enzyme-to-json';

configure({ adapter: new Adapter() });

expect.addSnapshotSerializer({ 
  test: val => val && val.findWhere !== undefined,
  print: val => JSON.stringify(toJson(val as any))
});