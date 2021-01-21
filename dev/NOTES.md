Some thoughts for clarity
=========================

Classes in these patterns describe how things should look.
`js-` prefixed classes describe how things should look if js in running/in action. They should NOT
be added manually to the markup; they get added by JS.

JS may also add `is--` classes for state purposes (ie is-open, is-animating)


data-js attributes ARE placed in the markup and are used as hooks and configuration for the JS.