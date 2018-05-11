import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import SelectField, { OptionPropType } from '../SelectField';
import Button from '../Button';
import './ConfigurationForm.css';

class ConfigurationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blockChain: props.blockChainFieldOptions[0].value,
            address: ''
        };
    }

    handleChange({ name, value }) {
        this.setState({ [name]: value });
    }

    handleSubmit(event) {
        event.preventDefault();

        const { onSubmit } = this.props;
        onSubmit && onSubmit({ ...this.state });
    }

    render() {
        const { className, labels, errors, blockChainFieldOptions, addressFieldOptions, disabled } = this.props;
        const { blockChain, address } = this.state;
        const classes = classNames('configuration-form', className);

        return (
            <div className={classes}>
                <h3>{labels.title}</h3>
                <form onSubmit={event => this.handleSubmit(event)}>
                    <div className="configuration-form-field">
                        <SelectField
                            name="blockChain"
                            label={labels.blockChainField}
                            options={blockChainFieldOptions}
                            value={blockChain}
                            onChange={payload => this.handleChange(payload)}
                            error={errors.blockChain}
                        />
                    </div>
                    <div className="configuration-form-field">
                        <SelectField
                            name="address"
                            label={labels.addressField}
                            options={addressFieldOptions}
                            value={address}
                            onChange={payload => this.handleChange(payload)}
                            error={errors.address}
                        />
                    </div>
                    <div className="configuration-form-actions">
                        <Button disabled={disabled}>{labels.button}</Button>
                        <br />
                        <small>{labels.helperText}</small>
                    </div>
                </form>
            </div>
        );
    }
}

ConfigurationForm.propTypes = {
    className: PropTypes.string,
    labels: PropTypes.shape({
        title: PropTypes.string,
        blockChainField: PropTypes.string,
        addressField: PropTypes.string,
        addressFieldHelperText: PropTypes.string,
        button: PropTypes.string,
        helperText: PropTypes.string
    }),
    errors: PropTypes.shape({
        address: PropTypes.string
    }),
    blockChainFieldOptions: PropTypes.arrayOf(OptionPropType),
    addressFieldOptions: PropTypes.arrayOf(OptionPropType),
    disabled: PropTypes.bool,
    onSubmit: PropTypes.func
};
ConfigurationForm.defaultProps = {
    labels: {
        title: 'Configuration',
        blockChainField: 'Blockchain',
        addressField: 'Your Address',
        button: 'Add Your Address',
        helperText: 'Assign your address to your Lition account'
    },
    errors: {},
    blockChainFieldOptions: [
        { value: 'ethereum', label: 'Ethereum' },
        { value: 'ledger', label: 'Ledger', disabled: true }
    ],
    addressFieldOptions: [{ value: '', label: 'Select your address', disabled: true }],
    disabled: false
};

export default ConfigurationForm;