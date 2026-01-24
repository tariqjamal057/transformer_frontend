import "./App.css";
import "./responsive.css";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import { useEffect, useState, createContext } from "react";
import LoadingBar from "react-top-loading-bar";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/Login";
import SelectCompany from "./components/SelectCompany";
import SelectSupplyTender from "./components/SelectSupplyTender";
import Dashboard from "./pages/Dashboard/Dashboard";
import Signup from "./components/Signup";
import Companies from "./components/Comapnies";
import SupplyTender from "./components/SupplyTender";
import AddTnNumber from "./pages/NewSupplyTender/AddTnNumber";
import TnNumberList from "./pages/NewSupplyTender/TnNumberList";
import AddLoa from "./pages/NewSupplyTender/AddLoa";
import LoaList from "./pages/NewSupplyTender/LoaList";
import AddDeliverySchedule from "./pages/NewSupplyTender/AddDeliverySchedule";
import DeliveryScheduleList from "./pages/NewSupplyTender/DeliverySchedule";
import AddDeffermentDetails from "./pages/NewSupplyTender/AddDefFerment";
import DeffermentList from "./pages/NewSupplyTender/DeffermentList";
import SubAdminList from "./pages/SubAdmin/SubAdminList";
import AddFinalInspection from "./pages/Final Inspection/AddFinalInspection";
import FinalInspectionList from "./pages/Final Inspection/FinalInspectionList";
import AddDeliveryChalan from "./pages/DeliveryChallan/AddDeliveryChalan";
import DeliveryChalanList from "./pages/DeliveryChallan/DeliveryChalanList";
import AddDeliveryDetails from "./pages/DeliveryDetails/AddDeliveryDetails";
import DeliveryDetailsList from "./pages/DeliveryDetails/DeliveryDetailsList";
import AddConsignee from "./pages/Consignee/AddConsignee";
import AddMaterialDescription from "./pages/Description/AddMaterialDescription";
import AddChalanDescription from "./pages/Description/AddChalanDescription";
import ConsigneeList from "./pages/Consignee/ConsigneeList";
import MaterialDescriptionList from "./pages/Description/MaterialDescriptionList";
import ChalanDescriptionList from "./pages/Description/ChalanDescriptionList";
import DamagedTransformerPage from "./pages/Final Inspection/DamagedTransformerPage";
import AddGPFailureInformation from "./pages/GPFailure/AddGPFailure";
import GPFailureInformationList from "./pages/GPFailure/GPFailureInformationList";
import AddNewGPReceiptRecord from "./pages/GPReceiptRecord/AddNewGPReceiptRecord";
import NewGPReceiptRecordList from "./pages/GPReceiptRecord/NewGPReceiptRecordList";
import AddGPReceiptNote from "./pages/GPReceiptRecord/AddGPReceiptNote";
import GPReceiptNote from "./pages/GPReceiptRecord/GPReceiptNote";
import AddFailureAnalysis from "./pages/FailureAnalysis/AddFailureAnalysis";
import FailureAnalysisList from "./pages/FailureAnalysis/FailureAnalysisList";
import MaterialOfferedButNominationPending from "./pages/MisReports/MaterialOfferedButNominationPending";
import MisReportsDashboard from "./pages/MisReports/MisReportsDashboard";
import DamagedTransformerList from "./pages/Final Inspection/DamagedTransformerList";
import NominationDone from "./pages/MisReports/NominationDone";
import InspectionDone from "./pages/MisReports/InspectionDone";
import DIReceived from "./pages/MisReports/DIReceived";
import ProductionPlanning from "./pages/MisReports/ProductionPlanning";
import AddOfferLetterAndSealingStatement from "./pages/OfferLetterAndSealingStatement/AddOfferLetterAndSealingStatement";
import AddNewGPInformation from "./pages/NewGPInformation/AddNewGPInformation";
import NewGPInformationList from "./pages/NewGPInformation/NewGPInformationList";
import NewGPTranformers from "./pages/MisReports/NewGPTransformers";
import NewGPSummary from "./pages/MisReports/NewGPSummary";
import SupplyGPExpiredStatement from "./pages/MisReports/SupplyGPExpiredStatement";
import GPExtendedWarrantyInformation from "./pages/MisReports/GPExtendedWarrantyInformation";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { permissionMapping } from "./data/permission";

export const MyContext = createContext();

const AppContent = () => {
  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [isOpenNav, setIsOpenNav] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [progress, setProgress] = useState(0);
  const [alertBox, setAlertBox] = useState({
    open: false,
    msg: "",
    error: false,
  });

  const [isHideSidebarAndHeader, setIsHideSidebarAndHeader] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const openNav = () => {
    setIsOpenNav(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertBox((prev) => ({ ...prev, open: false }));
  };

  return (
    <MyContext.Provider
      value={{
        isToggleSidebar,
        setIsToggleSidebar,
        isOpenNav,
        setIsOpenNav,
        windowWidth,
        openNav,
        setProgress,
        setAlertBox,
        setIsHideSidebarAndHeader,
      }}
    >
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        className="topLoadingBar"
      />

      {!isHideSidebarAndHeader && <Header />}

      <div className="main d-flex">
        {!isHideSidebarAndHeader && (
          <>
            <div
              className={`sidebarOverlay d-none ${
                isOpenNav === true && "show"
              }`}
              onClick={() => setIsOpenNav(false)}
            ></div>
            <div
              className={`sidebarWrapper ${
                isToggleSidebar === true ? "toggle" : ""
              } ${isOpenNav === true ? "open" : ""}`}
            >
              <Sidebar />
            </div>
          </>
        )}

        <div
          className={`content ${isHideSidebarAndHeader && "full"} ${
            isToggleSidebar === true ? "toggle" : ""
          }`}
        >
          <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            {/* <Route exact path="/select-company" element={<SelectCompany />}/>
            <Route exact path="/select-supply-tender" element={<SelectSupplyTender />}/> */}
            <Route
              exact
              path="/companies"
              element={<PrivateRoute element={<Companies />} />}
            />
            <Route
              exact
              path="/discom"
              element={<PrivateRoute element={<SupplyTender />} />}
            />
            <Route
              exact
              path="/"
              element={<PrivateRoute element={<DeliveryScheduleList />} />}
            />
            <Route
              exact
              path="/add-tnNumber"
              element={<PrivateRoute element={<AddTnNumber />} />}
            />
            <Route
              exact
              path="/tnNumber-list"
              element={<PrivateRoute element={<TnNumberList />} />}
            />
            <Route
              exact
              path="/add-loa"
              element={<PrivateRoute element={<AddLoa />} />}
            />
            <Route
              exact
              path="/loa-list"
              element={<PrivateRoute element={<LoaList />} />}
            />
            <Route
              exact
              path="/add-deliverySchedule"
              element={<PrivateRoute element={<AddDeliverySchedule />} />}
            />
            <Route
              exact
              path={permissionMapping.DeliverySchedule}
              element={<PrivateRoute element={<DeliveryScheduleList />} />}
            />
            <Route
              exact
              path="/add-deffermentDetails"
              element={<PrivateRoute element={<AddDeffermentDetails />} />}
            />
            <Route
              exact
              path="/defferment-list"
              element={<PrivateRoute element={<DeffermentList />} />}
            />
            <Route
              exact
              path={permissionMapping.SubAdmin}
              element={<PrivateRoute element={<SubAdminList />} />}
            />
            <Route
              exact
              path="/add-finalInspection"
              element={<PrivateRoute element={<AddFinalInspection />} />}
            />
            <Route
              exact
              path={permissionMapping.FinalInspection}
              element={<PrivateRoute element={<FinalInspectionList />} />}
            />
            <Route
              exact
              path="/add-deliveryChalan"
              element={<PrivateRoute element={<AddDeliveryChalan />} />}
            />
            <Route
              exact
              path={permissionMapping.DeliveryChallan}
              element={<PrivateRoute element={<DeliveryChalanList />} />}
            />
            <Route
              exact
              path="/add-deliveryDetails"
              element={<PrivateRoute element={<AddDeliveryDetails />} />}
            />
            <Route
              exact
              path={permissionMapping.DeliveryDetails}
              element={<PrivateRoute element={<DeliveryDetailsList />} />}
            />
            <Route
              exact
              path="/add-consignee"
              element={<PrivateRoute element={<AddConsignee />} />}
            />
            <Route
              exact
              path={permissionMapping.ConsigneeList}
              element={<PrivateRoute element={<ConsigneeList />} />}
            />
            <Route
              exact
              path="/add-materialDescription"
              element={<PrivateRoute element={<AddMaterialDescription />} />}
            />
            <Route
              exact
              path={permissionMapping.MaterialDescription}
              element={<PrivateRoute element={<MaterialDescriptionList />} />}
            />
            <Route
              exact
              path="/add-chalanDescription"
              element={<PrivateRoute element={<AddChalanDescription />} />}
            />
            <Route
              exact
              path="/chalanDescription-list"
              element={<PrivateRoute element={<ChalanDescriptionList />} />}
            />
            <Route
              exact
              path="/damageTransformer"
              element={<PrivateRoute element={<DamagedTransformerPage />} />}
            />
            <Route
              exact
              path="/add-GPFailureInformation"
              element={<PrivateRoute element={<AddGPFailureInformation />} />}
            />
            <Route
              exact
              path={permissionMapping.GPFailureInformation}
              element={<PrivateRoute element={<GPFailureInformationList />} />}
            />
            <Route
              exact
              path="/add-newGPReceiptRecord"
              element={<PrivateRoute element={<AddNewGPReceiptRecord />} />}
            />
            <Route
              exact
              path={permissionMapping.GPReceiptRecord}
              element={<PrivateRoute element={<NewGPReceiptRecordList />} />}
            />
            <Route
              exact
              path="/add-GPReceiptNote"
              element={<PrivateRoute element={<AddGPReceiptNote />} />}
            />
            <Route
              exact
              path={permissionMapping.GPReceiptNote}
              element={<PrivateRoute element={<GPReceiptNote />} />}
            />
            <Route
              exact
              path="/add-FailureAnalysis"
              element={<PrivateRoute element={<AddFailureAnalysis />} />}
            />
            <Route
              exact
              path={permissionMapping.FailureAnalysis}
              element={<PrivateRoute element={<FailureAnalysisList />} />}
            />
            <Route
              exact
              path="/mis-reports"
              element={<PrivateRoute element={<MisReportsDashboard />} />}
            />
            <Route
              exact
              path={permissionMapping.CTLOrDamageTransformer}
              element={<PrivateRoute element={<DamagedTransformerList />} />}
            />
            <Route
              exact
              path={permissionMapping.MaterialOfferedButNominationPendingReport}
              element={
                <PrivateRoute
                  element={<MaterialOfferedButNominationPending />}
                />
              }
            />
            <Route
              exact
              path={permissionMapping.NominationDoneReport}
              element={<PrivateRoute element={<NominationDone />} />}
            />
            <Route
              exact
              path={permissionMapping.InspectionReport}
              element={<PrivateRoute element={<InspectionDone />} />}
            />
            <Route
              exact
              path={permissionMapping.DIReceivedReport}
              element={<PrivateRoute element={<DIReceived />} />}
            />
            <Route
              exact
              path={permissionMapping.ProductionPlanningReport}
              element={<PrivateRoute element={<ProductionPlanning />} />}
            />
            <Route
              exact
              path={permissionMapping.OfferAndSealingStatement}
              element={
                <PrivateRoute element={<AddOfferLetterAndSealingStatement />} />
              }
            />
            <Route
              exact
              path="/add-newGPInformation"
              element={<PrivateRoute element={<AddNewGPInformation />} />}
            />
            <Route
              exact
              path={permissionMapping.newGPInformation}
              element={<PrivateRoute element={<NewGPInformationList />} />}
            />
            <Route
              exact
              path={permissionMapping.GPTransformerReport}
              element={<PrivateRoute element={<NewGPTranformers />} />}
            />
            <Route
              exact
              path="/new-gp-summary"
              element={<PrivateRoute element={<NewGPSummary />} />}
            />
            <Route
              exact
              path="/new-gp-expired-statement"
              element={<PrivateRoute element={<SupplyGPExpiredStatement />} />}
            />
            <Route
              exact
              path="gp-extended-warranty"
              element={
                <PrivateRoute element={<GPExtendedWarrantyInformation />} />
              }
            />
          </Routes>
        </div>
      </div>
      <Snackbar
        open={alertBox.open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={alertBox.error ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {alertBox.msg}
        </Alert>
      </Snackbar>
    </MyContext.Provider>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
