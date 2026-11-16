import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Notifications } from "./components/Notifications";
export default function App() {
    return (<>
      <RouterProvider router={router}/>
      <Notifications />
    </>);
}
