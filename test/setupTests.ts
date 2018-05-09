import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-15';

Enzyme.configure({ adapter: new Adapter() });

const context = (require as any).context('.', true, /./);
context.keys().forEach(context);