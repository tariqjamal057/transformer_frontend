import "./App.css";
import "./responsive.css"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import LoadingBar from "react-top-loading-bar";

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Signup from "./components/Signup";
import Companies from "./components/Comapnies";
import SupplyTenders from "./components/SupplyTender";
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


const MyContext = createContext();

function App() {

  const [isToggleSidebar, setIsToggleSidebar] = useState(false)
  const [isLogin, setIsLogin] = useState(false)
  const [isHideSidebarAndHeader, setIsHideSidebarAndHeader] = useState(false)
  const [isOpenNav, setIsOpenNav] =useState(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  const [progress, setProgress] = useState(0);

  const [alertBox, setAlertBox] = useState({
      open:false,
      error:false,
      msg:''
    })

  const handleClose = (event, reason) =>{
    if(reason === 'clickaway'){
      return;
    }

    setAlertBox({
      open:false
    })
  }

  useEffect(()=>{
    const handleResize = ()=>{
      setWindowWidth(window.innerWidth)
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize)
    }

  },[])

  const openNav=()=>{
    setIsOpenNav(true)
  }

  

  const values={
    isToggleSidebar,
    setIsToggleSidebar,
    isLogin,
    setIsLogin,
    isHideSidebarAndHeader,
    setIsHideSidebarAndHeader,
    windowWidth, 
    setWindowWidth,
    isOpenNav,
    openNav, 
    setIsOpenNav,
    setProgress,
    alertBox,
    setAlertBox
  }


  return (
    <Router>
      <MyContext.Provider value={values}>
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        className="topLoadingBar"
      />

      <Snackbar open={alertBox.open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={alertBox.error===false?'success' : 'error'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertBox.msg}
        </Alert>
      </Snackbar>
        {
          isHideSidebarAndHeader !== true && <Header/>
        }
    
      <div className="main d-flex">

        {
          isHideSidebarAndHeader !== true &&
          <>
          <div className={`sidebarOverlay d-none ${isOpenNav===true && 'show'}`} onClick={()=>setIsOpenNav(false)}></div>
          <div className={`sidebarWrapper ${isToggleSidebar === true ? 'toggle':''} ${isOpenNav === true ? 'open': ''}`}>
            <Sidebar/>
          </div>
          </>
        }
        

        <div className={`content ${isHideSidebarAndHeader === true && 'full'} ${isToggleSidebar === true ? 'toggle':''}`}>
          <Routes>
            <Route exact path = "/login" element={<Login/>} />
            <Route exact path="/signup" element={<PrivateRoute element={<Signup />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/companies" element={<PrivateRoute element={<Companies />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/supply-tenders" element={<PrivateRoute element={<SupplyTenders />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/" element={<PrivateRoute element={<DeliveryScheduleList />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/add-tnNumber" element={<PrivateRoute element={<AddTnNumber />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/tnNumber-list" element={<PrivateRoute element={<TnNumberList />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/add-loa" element={<PrivateRoute element={<AddLoa />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/loa-list" element={<PrivateRoute element={<LoaList />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/add-deliverySchedule" element={<PrivateRoute element={<AddDeliverySchedule />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/deliverySchedule-list" element={<PrivateRoute element={<DeliveryScheduleList />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/add-deffermentDetails" element={<PrivateRoute element={<AddDeffermentDetails />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/defferment-list" element={<PrivateRoute element={<DeffermentList />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/subadmin-list" element={<PrivateRoute element={<SubAdminList />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/add-finalInspection" element={<PrivateRoute element={<AddFinalInspection />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/finalInspection-list" element={<PrivateRoute element={<FinalInspectionList />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/add-deliveryChalan" element={<PrivateRoute element={<AddDeliveryChalan />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/deliveryChalan-list" element={<PrivateRoute element={<DeliveryChalanList />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/add-deliveryDetails" element={<PrivateRoute element={<AddDeliveryDetails />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/deliveryDetails-list" element={<PrivateRoute element={<DeliveryDetailsList />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/add-consignee" element={<PrivateRoute element={<AddConsignee />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/consignee-list" element={<PrivateRoute element={<ConsigneeList />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/add-materialDescription" element={<PrivateRoute element={<AddMaterialDescription />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/materialDescription-list" element={<PrivateRoute element={<MaterialDescriptionList />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/add-chalanDescription" element={<PrivateRoute element={<AddChalanDescription />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/chalanDescription-list" element={<PrivateRoute element={<ChalanDescriptionList />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/damageTransformer" element={<PrivateRoute element={<DamagedTransformerPage />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/add-GPFailureInformation" element={<PrivateRoute element={<AddGPFailureInformation />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/GPFailureInformation-list" element={<PrivateRoute element={<GPFailureInformationList />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/add-newGPReceiptRecord" element={<PrivateRoute element={<AddNewGPReceiptRecord />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/GPReceiptRecord-list" element={<PrivateRoute element={<NewGPReceiptRecordList/>} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/add-GPReceiptNote" element={<PrivateRoute element={<AddGPReceiptNote />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/GPReceiptNote-list" element={<PrivateRoute element={<GPReceiptNote />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/add-FailureAnalysis" element={<PrivateRoute element={<AddFailureAnalysis />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/failureAnalysis-list" element={<PrivateRoute element={<FailureAnalysisList />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/mis-reports" element={<PrivateRoute element={<MisReportsDashboard />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/damageTransformer-list" element={<PrivateRoute element={<DamagedTransformerList />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/materialOfferedButNominationPending-list" element={<PrivateRoute element={<MaterialOfferedButNominationPending />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/nomination-done" element={<PrivateRoute element={<NominationDone />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/inspection-done" element={<PrivateRoute element={<InspectionDone />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/di-received" element={<PrivateRoute element={<DIReceived />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/production-planning" element={<PrivateRoute element={<ProductionPlanning />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/add-OfferLetter&SealingStatement" element={<PrivateRoute element={<AddOfferLetterAndSealingStatement />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/add-newGPInformation" element={<PrivateRoute element={<AddNewGPInformation />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/newGPInformation-list" element={<PrivateRoute element={<NewGPInformationList />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/new-gp-transformers" element={<PrivateRoute element={<NewGPTranformers />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/new-gp-summary" element={<PrivateRoute element={<NewGPSummary />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="/new-gp-expired-statement" element={<PrivateRoute element={<SupplyGPExpiredStatement />} allowedRoles={["superadmin"]}/>}/>
            <Route exact path="gp-extended-warranty" element={<PrivateRoute element={<GPExtendedWarrantyInformation />} allowedRoles={["superadmin"]}/>}/>
          </Routes>
        </div>
      </div>
      </MyContext.Provider>
    </Router>
  );
}

export default App;
export {MyContext};