/*
This implements a Redux application that models an insurance company.
*/
console.clear();

const { createStore, combineReducers } = Redux;

/*
People dropping off forms (Action Creators)

Whenever an Action Creator is called inside of our application,
it is going to return an object that represents
how some amount of data needs to be changed inside of our insurance company.
*/
// Return a form
const createClaim = (name, amountOfMoneyToCollect) => {
  return {
    type: "CREATE_CLAIM",
    payload: {
      name: name,
      amountOfMoneyToCollect: amountOfMoneyToCollect,
    },
  };
};

const createPolicy = (name) => {
  return {
    type: "CREATE_POLICY",
    payload: {
      name: name,
      amount: 20,
    },
  };
};

const deletePolicy = (name) => {
  return {
    type: "DELETE_POLICY",
    payload: {
      name: name,
    },
  };
};

/*
Departments of our company (Reducers)

We do not change the old state directly;
instead we create a brand-new state, modify it if necessary, and return that.
The reason:
1) at some point in time, Redux needs to decide
   whether or not any changes were made inside of your reducer;
2) Redux does that by looking at the old state and at the new state,
   and checks if it's the exact same object in memory

(Quick reminder: in JavaScript, numbers are immutable,
so whenever we return a different number, Redux decides that some data was changed.
This means we don't need to use any fancy array syntax when working with a number.)
*/
const initialListOfClaims = [];

const claimsHistory = (oldListOfClaims = initialListOfClaims, action) => {
  if (action.type === "CREATE_CLAIM") {
    return [...oldListOfClaims, action.payload];
  }

  return oldListOfClaims;
};

const initialBagOfMoney = 100;

const accounting = (bagOfMoney = initialBagOfMoney, action) => {
  if (action.type === "CREATE_CLAIM") {
    return bagOfMoney - action.payload.amountOfMoneyToCollect;
  } else if (action.type === "CREATE_POLICY") {
    return bagOfMoney + action.payload.amount;
  }

  return bagOfMoney;
};

const initialListOfPolicies = [];

const policies = (listOfPolicies = initialListOfPolicies, action) => {
  if (action.type === "CREATE_POLICY") {
    return [...listOfPolicies, action.payload.name];
  } else if (action.type === "DELETE_POLICY") {
    return listOfPolicies.filter((policy) => policy != action.payload.name);
  }

  return listOfPolicies;
};

// Wire the individual reducers/departments into one cohesive unit.
// (Company setup)
/*
Whenever a person drops off a form
(= Whenever an Action Creator is called inside our application),
the following *combined* object is going to send the form/Action to all reducers.
*/
const ourDepartments = combineReducers({
  claimsHistory: claimsHistory,
  accounting: accounting,
  policies: policies,
});

/*
Create an object that represents our insurance company as a whole
*/
const store = createStore(ourDepartments);

/*
Now the modeling/implementation of the insurance company is finished,
so we can play around with the company:
*/
store.dispatch(createPolicy("Alex"));
store.dispatch(createClaim("Alex", 100));
store.dispatch(deletePolicy("Alex"));

console.log(store.getState());

store.dispatch(createPolicy("Alex"));
store.dispatch(createClaim("Alex", 100));
store.dispatch(deletePolicy("Alex"));

store.dispatch(createPolicy("Alex"));
store.dispatch(createClaim("Alex", 100));
store.dispatch(deletePolicy("Alex"));

console.log(store.getState());
