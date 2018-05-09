import * as React from 'react';
import { shallow } from 'enzyme';

import Overlay from 'components/overlay';

describe('<Overlay />', () => {
	it('renders null when isVisible is false', () => {
		const container = shallow(<Overlay isVisible={false} />);

		expect(container.isEmptyRender());
	})
})