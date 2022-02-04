# CS 46N Text Tool

## Adding a new analysis type

1. Add the name of the analysis type to the `OperationsType` enum in `runQuery.ts`.
2. In the same file, create a new interface that extends from `Params` and contains the parameters that your analysis will need. At the very least, it will need an `output` parameter, whose value is a string.
3. Modify `runQuery` to handle the new analysis type. You can assume that `data` will be a list of objects with the same structure as the interface you just created. They will also have an additional `type` variable which is an instance of `OperationsType` and can be used to determine which type of analysis to run. `runQuery` should return a list of objects, which will replace the old list. (i.e. it should probably have the same data, with an additional variable)
4. Build the view for the new analysis type. Modify the `Operation` component in `Process.tsx` to render the new view.
   1. In the `constructor`, add a new condition to check for the analysis type you're adding and set the `state` to a reasonable default (`state` should have the same structure as the interface you made in part 2).
   2. Add functions to update and render the component. You can peruse the existing `update` and `render` functions to see how to do this. Basically, when the user clicks `Run Analysis`, the state will be sent to the `runQuery` function along with the data.
   3. Modify the `render()` method to call the correct function based on `this.props.type`.


## Styling

The project uses lots of bootstrap styles, and some custom styles in `App.css`.