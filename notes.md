# BASICS

What is the genesis file?
- One of the two things (+ network id) needed to start a new Ethereum network or run a node

What is "chaindata"?
- Name of the geth folder where all the blockchain data lives

What is Postfix Notation?
- Also known as Reverse Polish Notation, it defines the order of operations and is used in every stack-based programming language

# SOLIDITY
Why should you always check `assert(arg1 - arg2 <= arg1)` when subtracting uints?
- Because if the result is negative, it will wrap and create a huge number

## State variables - 3 types:
- private: only current contract can read/write
- internal: only current contract & child contracts can read/write
- public all can read but only contract & children can write
  - invoked as functions (helps to communicate they're read-only)

**Variables default to internal, functions default to public**

## Contract inheritance
- If parent constructor takes arguments, it must be called in child contract's constructor, but if the parent constructor doesn't take args, it gets called implicitly by the child
- a child's function can override the parent's if they have the same name (potential source of silent error)
- When the parent constructor takes arguments, it has to be called explicitly. So the child's constructor should be:
`constructor(uint initial) Parent(initial) {}` 

## Functions
- public by default
- `<address>.send()` and `<address>.transfer()` execute the fallback method if called on a contract address and costs 2300 gas
- `<address>.call.value()("")` will pass all the gas deemed necessary by the compiler
- a contract function's scope is the contract, but a library function's scope is dynamic
- only use `public` if the function needs to be called internally, otherwise use `external` (Solidity copies public arguments to memory so they can be accessed internally, which nearly doubles gas use)
- `constant` signals developer intent that a function doesn't change the contract's internal state (ie: used for reading values), however it isn't enforced by the compiler
- `view` basically replaces constant and signals the function should not write to the state. That includes emitting an event. The compiler throws a warning (*NOT an error)
- `pure` neither reading or writing to the state. ie: a deterministic helper function that only uses its arguments. Enforced with an error.
- parent functions can be overrided by child functions of the same name
- `payable` must be added to the function signature if it can receive value (can't be combined with `view`, `pure`, or `constant`, since it changes the state)
- Prefixing a public function with `this.` makes it behave like an external function, i.e., it generates an internal transaction
- You cannot prefix a function with `this.`, unless it is public. 

### Return values
- max of 14 different return values from any given function, all of which can be named (which helps in building a readable ABI)
- struct types can only be returned on `private` or `internal` calls


### Modifier functions 
Modifier functions are helpers that can be called before another fucntion like this:
```
   function changeLimit(uint newLimit)
        public
        onlyOwnerAllowed()
        returns (bool) {
        limit = newLimit;
        return true;
    }
```

they should be prefixed with `modifer` and end with ` _;` like this:
```
    modifier onlyMe () {
        require(msg.sender == owner);
        _;
    }
```
### Built-in function variables:
- `now` / `block.timestamp` (type: `uint`) : current block timestamp, which will be the same for all transactions in the block
- `msg.sender` (type: `address`)
- `msg.value` (type: `uint`)
- `tx.origin` (type: `address`) : address of the external account that initiated the whole transaction chain

### Built-in functions
- `revert()` stops the execution & reverts the states and balances as they were before the transaction
  - before Byzantium, it used all the gas as a way to punish the caller. Now, the way to acheive that is: 
  `assembly { invalid }`
- `require(requirement1)` is a way of doing `revert()` without an `if` check
- `assert()` is like `require()` but consumes all gas, and is typically used for checking invariants, ala `aliceBalance + bobBalance < totalBalance` (important for formal verification) "Properly functioning code should never reach a failing assert statement; if this happens there is a bug in your contract which you should fix."[- Solidity docs](https://solidity.readthedocs.io/en/v0.4.24/control-structures.html)
- fallback function: not named, and should only be `payable` when the contract simply collects funds

### Internal / External function calls
- An internal transaction: a call from one contract to another
- An external call is one that is called from one contract to another, and involves an internal transaction
- gas & value can be set when calling an external function, like so:
```
function callOther() public {
    otherContract.someFunction.value(123).gas(100000)(args);
}
```
- `this.f()` triggers an internal tx (ie: costs gas to trigger the function eventhough it exists in the same contract its called from)...useful for multisignature contracts, like when a new owner gets added

## Interfaces
- can define function definitions by simply ommitting the `{}` and ending with `;` like so:
```
interface LeftHandI {
    function isLeftHand() pure public returns (bool);
}
```

## Events
- the `indexed` keyword can be put in front of a function param to indictate that value should be indexed in the logs, ex:
```
event LogOwnerChanged(address indexed previousOwner, address newOwner);
```
...up to 3 params can be indexed
- "It is advisable to always prefix your events with Log as this helps identify them as such"

## Security best practices
- never create a situation where the loop length is controlled by a party that would not be the only one suffering from its failure
-  always update storage values before sending funds. If storage is updated after, it opens the contract up for attack through flooding the call stack (ie: so the call stack overflows right after the funds are sent, and before the contract's state is updated to reflect the send)
- always check the return values on internal transactions
