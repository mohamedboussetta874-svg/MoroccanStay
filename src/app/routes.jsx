import { createBrowserRouter } from "react-router";
import { LoginPage }          from "./pages/login-page";
import { HomePage }           from "./pages/home-page";
import { HotelDetailsPage }   from "./pages/hotel-details-page";
import { ReservationPage }    from "./pages/reservation-page";
import { PaymentPage }        from "./pages/payment-page";
import { AdminDashboard }     from "./pages/admin-dashboard";
import { GuidePanel }         from "./pages/guide-panel";
import { SearchResultsPage }  from "./pages/search-results-page";
import { NotFoundPage }       from "./pages/not-found-page";
import { ProtectedRoute }     from "./components/ProtectedRoute";
import { RootRedirect }       from "./components/RootRedirect";

export const router = createBrowserRouter(
  [
    /* Root → smart redirect */
    { path: "/",              Component: RootRedirect     },

    /* Auth */
    { path: "/login",         Component: LoginPage        },
    { path: "/select-role",   Component: LoginPage        }, /* legacy */
    { path: "/admin/login",   Component: LoginPage        }, /* legacy */

    /* Public — no login required */
    { path: "/home",          Component: HomePage         },
    { path: "/hotel/:id",     Component: HotelDetailsPage },
    { path: "/search",        Component: SearchResultsPage},
    { path: "/guide",         Component: GuidePanel       },

    /* Require login (handled inside page with AuthModal) */
    { path: "/reservation/:id", Component: ReservationPage },
    { path: "/payment/:id",   Component: PaymentPage      },

    /* Admin only */
    { path: "/admin", Component: () => <ProtectedRoute Component={AdminDashboard}/> },

    { path: "*", Component: NotFoundPage },
  ],
  { basename: import.meta.env.BASE_URL }
);