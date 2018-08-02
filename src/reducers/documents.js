export const initialState = {
    documentsList: { data: { documents: [], numberOfDocuments: 0 }, error: null, loading: false }
};

export function documentsReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_DOCUMENTS': {
            const { payload, meta = [] } = action;
            const [page] = meta;

            return {
                ...state,
                documentsList: {
                    data: payload
                        ? {
                              ...payload,
                              documents: page
                                  ? [...state.documentsList.data.documents, ...payload.documents]
                                  : payload.documents
                          }
                        : state.documentsList.data,
                    loading: action.loading,
                    error: action.error
                }
            };
        }

        default:
            return state;
    }
}
