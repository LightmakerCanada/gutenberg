/**
 * External dependencies
 */
import { noop } from 'lodash';
import classnames from 'classnames';
import {
	unstable_useCompositeState as useCompositeState,
	unstable_Composite as Composite,
	unstable_CompositeGroup as CompositeGroup,
} from 'reakit';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useInstanceId } from '@wordpress/compose';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Cell from './cell';
import { Root, Row } from './styles/alignment-matrix-control-styles';
import { useRTL } from '../utils/rtl';
import AlignmentMatrixControlIcon from './icon';
import { GRID, getItemId } from './utils';

function useBaseId( id ) {
	const instanceId = useInstanceId(
		AlignmentMatrixControl,
		'alignment-matrix-control'
	);

	return id || instanceId;
}

export default function AlignmentMatrixControl( {
	className,
	id,
	label = __( 'Alignment Matrix Control' ),
	defaultValue = 'center center',
	value,
	onChange = noop,
	width = 92,
	...props
} ) {
	const [ immutableDefaultValue ] = useState( value ?? defaultValue );
	const isRTL = useRTL();
	const baseId = useBaseId( id );
	const initialCurrentId = getItemId( baseId, immutableDefaultValue );

	const composite = useCompositeState( {
		baseId,
		currentId: initialCurrentId,
		rtl: isRTL,
	} );

	const handleOnChange = ( nextValue ) => {
		onChange( nextValue );
	};

	useEffect( () => {
		if ( typeof value !== 'undefined' ) {
			composite.setCurrentId( getItemId( baseId, value ) );
		}
	}, [ value, composite.setCurrentId ] );

	const classes = classnames(
		'component-alignment-matrix-control',
		className
	);

	return (
		<Composite
			{ ...props }
			{ ...composite }
			aria-label={ label }
			as={ Root }
			className={ classes }
			role="grid"
			width={ width }
		>
			{ GRID.map( ( cells, index ) => (
				<CompositeGroup
					{ ...composite }
					as={ Row }
					role="row"
					key={ index }
				>
					{ cells.map( ( cell ) => {
						const cellId = getItemId( baseId, cell );
						const isActive = composite.currentId === cellId;

						return (
							<Cell
								{ ...composite }
								id={ cellId }
								isActive={ isActive }
								key={ cell }
								value={ cell }
								onFocus={ () => handleOnChange( cell ) }
								onClick={ () =>
									// VoiceOver doesn't focus elements on click
									composite.move( cellId )
								}
							/>
						);
					} ) }
				</CompositeGroup>
			) ) }
		</Composite>
	);
}

AlignmentMatrixControl.Icon = AlignmentMatrixControlIcon;
