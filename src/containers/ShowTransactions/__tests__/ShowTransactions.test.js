import React from 'react';
import { Provider } from 'react-redux';
import ShowTransactionsContainer, { ShowTransactions } from '../ShowTransactions';
import { CoinButton, Loader, RecentTransactions } from '../../../components';
import { mountWithIntl, shallowWithIntl } from '../../../services/intlTestHelper';
import configureMockStore from 'redux-mock-store';

import * as usersActions from '../../../action_performers/users';
import * as notificationActions from '../../../action_performers/notifications';
import * as txActions from '../../../action_performers/transactions';
import * as appActions from '../../../action_performers/app';

const context = {
    intl: {
        formatMessage: jest.fn()
    },
    router: {
        history: { push: jest.fn() }
    }
};

const mockStore = configureMockStore();
const store = mockStore({
    Users: {
        profile: {
            data: {
                user: {
                    id: 1
                }
            }
        }
    },
    Transactions: {
        recentTransactions: {
            data: {
                currentBalance: {
                    date: 1523707200,
                    balance: 40.4
                },
                hasNextTransactions: 3,
                transactions: [
                    {
                        id: 1,
                        date: 1523707200,
                        name: 'Bought 23 kWh Alice',
                        amount: 0.81
                    },
                    {
                        id: 2,
                        date: 1523707200,
                        name: 'Monthly invoice',
                        amount: 0.81
                    },
                    {
                        id: 3,
                        date: 1523707200,
                        name: 'Bought 23 kWh from Peter',
                        amount: 0.81
                    }
                ]
            },
            loading: false,
            error: null
        }
    }
});

const props = {
    recentTransactions: {
        currentBalance: {
            date: 1523707200,
            balance: 40.4
        },
        hasNextTransactions: 3,
        transactions: [
            {
                id: 1,
                date: 1523707200,
                name: 'Bought 23 kWh Alice',
                amount: 0.81
            },
            {
                id: 2,
                date: 1523707200,
                name: 'Monthly invoice',
                amount: 0.81
            },
            {
                id: 3,
                date: 1523707200,
                name: 'Bought 23 kWh from Peter',
                amount: 0.81
            }
        ]
    },
    user: { id: 'testId' },
    loading: false,
    error: null
};

function renderContainer() {
    return mountWithIntl(
        <Provider store={store}>
            <ShowTransactionsContainer context={context} />
        </Provider>
    );
}

function renderComponent() {
    return shallowWithIntl(<ShowTransactions {...props} context={context} />);
}

describe('<ShowTransactions /> Component', () => {
    jest.useFakeTimers();

    const mainContainerMock = document.createElement('div');

    beforeEach(() => {
        context.router.history.push = jest.fn();
        context.intl.formatMessage = jest.fn();
        usersActions.performGetUserData = jest.fn();
        txActions.performGetRecentTransactions = jest.fn();
        notificationActions.performPushNotification = jest.fn();
        appActions.performSetupBreadcrumbs = jest.fn();

        jest.spyOn(document, 'getElementById').mockReturnValue(mainContainerMock);
        jest.spyOn(mainContainerMock, 'addEventListener');
        jest.spyOn(mainContainerMock, 'removeEventListener');
    });

    it(`should contains following controls:
        - 1 <RecentTransactions /> component;
        - 1 <Loader /> component;
        - 2 <section> and one with class "overview-page";
        - 1 <h1> element;`, () => {
        const component = renderContainer();

        expect(component.find('section.show-transaction-page')).toHaveLength(1);
        expect(component.find('section')).toHaveLength(2);
        expect(component.find(Loader)).toHaveLength(1);
        expect(component.find(RecentTransactions)).toHaveLength(1);
    });

    it('should handler scroll event', () => {
        const component = renderComponent();
        const handleScrollMock = component.instance().scrollHandler;

        expect(mainContainerMock.addEventListener).toHaveBeenCalledWith('scroll', component.instance().scrollHandler);

        component.unmount();
        expect(mainContainerMock.removeEventListener).toHaveBeenCalledWith('scroll', handleScrollMock);
    });

    it('should call prepare common function', () => {
        const component = renderContainer();
        const table = component.find(RecentTransactions).at(0);
        const tableProps = table.props();
        delete tableProps.onButtonClick;
        expect(tableProps).toEqual({
            pagination: true,
            loading: false,
            currentBalance: {
                date: 1523707200,
                balance: 40.4
            },
            labels: {
                header: 'Show Transactions',
                recentTransactionsMonthlyBalance: 'Monthly Balance',
                recentTransactionsHeaderAmount: 'Amount',
                recentTransactionsHeaderDate: 'Date',
                recentTransactionsHeaderTransaction: 'Transaction',
                recentTransactionsMore: 'More',
                recentTransactionsTitle: 'Most Recent Transactions',
                sellCoinsButton: 'Sell Coins',
                buyCoinsButton: 'Buy Coins'
            },
            transactions: [
                { amount: 0.81, date: 1523707200, id: 1, name: 'Bought 23 kWh Alice' },
                { amount: 0.81, date: 1523707200, id: 2, name: 'Monthly invoice' },
                { amount: 0.81, date: 1523707200, id: 3, name: 'Bought 23 kWh from Peter' }
            ]
        });
    });

    it('should returns correct props map', () => {
        const stateDummy = {
            Transactions: {
                recentTransactions: {
                    data: {
                        numberOfTransactions: 20,
                        transactions: ['tx_test']
                    },
                    error: null,
                    loading: 'tx_loading'
                }
            },
            Users: {
                profile: {
                    data: { user: 'user_data' },
                    error: 'test_error',
                    loading: 'test_loading'
                }
            }
        };
        const props = ShowTransactions.mapStateToProps(stateDummy);
        expect(props).toEqual({
            recentTransactions: {
                numberOfTransactions: 20,
                transactions: ['tx_test']
            },
            hasNextTransactions: true,
            transactionsLoading: 'tx_loading',
            user: 'user_data',
            error: 'test_error',
            loading: 'test_loading'
        });
    });

    it('should perform related actions on did mount step', () => {
        renderContainer();

        expect(appActions.performSetupBreadcrumbs.mock.calls.length).toEqual(1);
        const [[bArg1]] = appActions.performSetupBreadcrumbs.mock.calls;
        expect(bArg1).toEqual([
            { icon: 'faHome', id: '', label: 'Trading', path: '/' },
            { id: 'show_transactions', label: 'Show Transactions', path: '/show_transactions' }
        ]);

        expect(usersActions.performGetUserData.mock.calls.length).toEqual(1);

        const component = renderComponent();
        expect(usersActions.performGetUserData.mock.calls.length).toEqual(2);
        expect(txActions.performGetRecentTransactions.mock.calls.length).toEqual(0);

        component.setProps({ user: { id: 10 } });
        expect(txActions.performGetRecentTransactions.mock.calls.length).toEqual(1);
        const [[userId]] = txActions.performGetRecentTransactions.mock.calls;
        expect(userId).toEqual(10);

        component.setProps({ error: { message: 'Error Message' } });
        expect(notificationActions.performPushNotification.mock.calls.length).toEqual(1);
        const [[error]] = notificationActions.performPushNotification.mock.calls;
        expect(error).toEqual({ message: 'Error Message', type: 'error' });
    });
});
