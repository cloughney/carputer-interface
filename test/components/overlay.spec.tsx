import * as React from 'react';
import { shallow } from 'enzyme';

import Overlay from 'components/overlay';

describe('<Overlay />', () => {
	it('should be a thing', () => {
		const container = shallow(<Overlay isVisible={false} />);

		expect(container.isEmptyRender());
	})
})
