const INITIAL_STATE = {
  contacts: [],
  newFileImport: '',
  contactDetails: {
    id: '',
    firstName: '',
    lastName: '',
    phoneNumber:'',
    subtitle: '',
    designation: '',
    favorited:false,
    myTeam: false,
    image: '',
    quotation: '',
    invoice: '',
    document: '',
  },
  contactDetail: {
    id: '',
    firstName: '',
    lastName: '',
    phoneNumber:'',
    subtitle: '',
    designation: '',
    myTeam: false,
    favorited:false,
    businessCards: [],
    quotations: [],
    invoices: [],
    documents: [],
  },
  urlDetails: {imageUrl: '', quotationUrl: ''},
};
export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SET_CONTACT':
      return {...state, contacts: action.payload};
    case 'FETCH_CONTACT':
      return {...state, contacts: action.payload};
    case 'SET_NEWFILE_IMPORT':
      return {...state, newFileImport: action.payload};
    case 'SET_CONTACT_DETAILS':

   //  console.log("return", action.payload);
    
      return {...state, contactDetail: action.payload};
    case 'SET_URL_DETAILS':
      return {...state, urlDetails: action.payload};

    default:
      return state;
  }
}
