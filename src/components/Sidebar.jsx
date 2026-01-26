import { Button } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { GrVirtualMachine } from "react-icons/gr";
import { FaAngleRight } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../App";
import { FaUserShield } from "react-icons/fa";
import { LuInspectionPanel } from "react-icons/lu";
import { TbTruckDelivery } from "react-icons/tb";
import { RiFileDamageFill } from "react-icons/ri";
import { MdSmsFailed, MdHistory } from "react-icons/md";
import { IoDocuments } from "react-icons/io5";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(null);

  const { setAlertBox, windowWidth, setIsOpenNav, hasPermission } =
    useContext(MyContext);

  const isOpenSubmenu = (index) => {
    if (activeTab === index) {
      setActiveTab(null); // Close if already open
    } else {
      setActiveTab(index); // Open new submenu
    }
  };

  const handleCloseSidebarOnMobile = () => {
    if (windowWidth < 992) {
      setIsOpenNav(false);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="sidebar" style={{ background: "#b2972cff" }}>
      <ul>
        {/*<li>
                    <Link to='/' onClick={handleCloseSidebarOnMobile}>
                        <Button className={`w-100 ${activeTab === 0 ? 'active' : ''}`} onClick={() => setActiveTab(0)}>
                            <span className='icon'><MdDashboard /></span>
                            Dashboard
                        </Button>
                    </Link>
                </li>*/}

        {/* Ads */}
        {(hasPermission("DeliveryScheduleList") ||
          hasPermission("ConsigneeList") ||
          hasPermission("MaterialDescriptionList")) && (
          <li>
            <Button
              className={`w-100 ${activeTab === 1 ? "active" : ""}`}
              onClick={() => isOpenSubmenu(1)}
            >
              <span className="icon">
                <GrVirtualMachine />
              </span>{" "}
              MASTER RECORD NEW SUPPLY TENDER INFORMATION
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
            <div
              className={`submenuWrapper ${activeTab === 1 ? "colapse" : "colapsed"}`}
            >
              <ul className="submenu">
                {/*<li><Link to='/tnNumber-list' onClick={handleCloseSidebarOnMobile}>TN Number, Rating & Discom</Link></li>*/}
                {hasPermission("DeliveryScheduleList") && (
                  <li>
                    <Link
                      to="/deliverySchedule-list"
                      onClick={handleCloseSidebarOnMobile}
                    >
                      Master Record Of New Supply Tender
                    </Link>
                  </li>
                )}
                {/*<li><Link to='/loa-list' onClick={handleCloseSidebarOnMobile}>LOA & PO Details</Link></li>
                            <li><Link to='/defferment-list' onClick={handleCloseSidebarOnMobile}>Defferment Details</Link></li>*/}
                {hasPermission("ConsigneeList") && (
                  <li>
                    <Link
                      to="/consignee-list"
                      onClick={handleCloseSidebarOnMobile}
                    >
                      Consignee List
                    </Link>
                  </li>
                )}
                {hasPermission("MaterialDescriptionList") && (
                  <li>
                    <Link
                      to="/materialDescription-list"
                      onClick={handleCloseSidebarOnMobile}
                    >
                      Material Descriptions
                    </Link>
                  </li>
                )}
                {/*<li><Link to='/chalanDescription-list' onClick={handleCloseSidebarOnMobile}>Chalan Descriptions</Link></li>*/}
              </ul>
            </div>
          </li>
        )}

        {hasPermission("SubAdminList") && (
          <li>
            <Link to="/subadmin-list" onClick={handleCloseSidebarOnMobile}>
              <Button
                className={`w-100 ${activeTab === 2 ? "active" : ""}`}
                onClick={() => setActiveTab(2)}
              >
                <span className="icon">
                  <FaUserShield />
                </span>
                Create Users
              </Button>
            </Link>
          </li>
        )}

        {hasPermission("FinalInspectionList") && (
          <li>
            <Link
              to="/finalInspection-list"
              onClick={handleCloseSidebarOnMobile}
            >
              <Button
                className={`w-100 ${activeTab === 3 ? "active" : ""}`}
                onClick={() => setActiveTab(3)}
              >
                <span className="icon">
                  <LuInspectionPanel />
                </span>
                Final Inspection Details
              </Button>
            </Link>
          </li>
        )}

        {hasPermission("CTLOrDamageTransformerList") && (
          <li>
            <Link
              to="/damageTransformer-list"
              onClick={handleCloseSidebarOnMobile}
            >
              <Button
                className={`w-100 ${activeTab === 4 ? "active" : ""}`}
                onClick={() => setActiveTab(4)}
              >
                <span className="icon">
                  <RiFileDamageFill />
                </span>
                CTL Failed / Damaged Transformer List
              </Button>
            </Link>
          </li>
        )}

        {(hasPermission("DeliveryChallanList") ||
          hasPermission("DeliveryDetailsList")) && (
          <li>
            <Button
              className={`w-100 ${activeTab === 5 ? "active" : ""}`}
              onClick={() => isOpenSubmenu(5)}
            >
              <span className="icon">
                <TbTruckDelivery />
              </span>{" "}
              DELIVERY CHALLAN & DETAILS
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
            <div
              className={`submenuWrapper ${activeTab === 5 ? "colapse" : "colapsed"}`}
            >
              <ul className="submenu">
                {hasPermission("DeliveryChallanList") && (
                  <li>
                    <Link
                      to="/deliveryChalan-list"
                      onClick={handleCloseSidebarOnMobile}
                    >
                      Delivery Challan
                    </Link>
                  </li>
                )}
                {hasPermission("DeliveryDetailsList") && (
                  <li>
                    <Link
                      to="/deliveryDetails-list"
                      onClick={handleCloseSidebarOnMobile}
                    >
                      Delivery List of Transformers
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </li>
        )}

        {(hasPermission("GPFailureInformationList") ||
          hasPermission("GPReceiptRecordList") ||
          hasPermission("GPReceiptNoteList") ||
          hasPermission("newGPInformationList") ||
          hasPermission("FailureAnalysisList")) && (
          <li>
            <Button
              className={`w-100 ${activeTab === 6 ? "active" : ""}`}
              onClick={() => isOpenSubmenu(6)}
            >
              <span className="icon">
                <MdSmsFailed />
              </span>{" "}
              MASTER RECORD OF G.P. INFORMATION
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
            <div
              className={`submenuWrapper ${activeTab === 6 ? "colapse" : "colapsed"}`}
            >
              <ul className="submenu">
                {hasPermission("GPFailureInformationList") && (
                  <li>
                    <Link
                      to="/GPFailureInformation-list"
                      onClick={handleCloseSidebarOnMobile}
                    >
                      G.P. Failure Information
                    </Link>
                  </li>
                )}
                {hasPermission("GPReceiptRecordList") && (
                  <li>
                    <Link
                      to="/GPReceiptRecord-list"
                      onClick={handleCloseSidebarOnMobile}
                    >
                      New G.P. Receipt Record
                    </Link>
                  </li>
                )}
                {hasPermission("GPReceiptNoteList") && (
                  <li>
                    <Link
                      to="/GPReceiptNote-list"
                      onClick={handleCloseSidebarOnMobile}
                    >
                      G.P. Receipt Note
                    </Link>
                  </li>
                )}
                {hasPermission("newGPInformationList") && (
                  <li>
                    <Link
                      to="/newGPInformation-list"
                      onClick={handleCloseSidebarOnMobile}
                    >
                      New G.P. Information
                    </Link>
                  </li>
                )}
                {hasPermission("FailureAnalysisList") && (
                  <li>
                    <Link
                      to="/failureAnalysis-list"
                      onClick={handleCloseSidebarOnMobile}
                    >
                      Failure Analysis
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </li>
        )}

        {hasPermission("OfferAndSealingStatement") && (
          <li>
            <Link
              to="/add-OfferLetter&SealingStatement"
              onClick={handleCloseSidebarOnMobile}
            >
              <Button
                className={`w-100 ${activeTab === 7 ? "active" : ""}`}
                onClick={() => setActiveTab(7)}
              >
                <span className="icon">
                  <IoDocuments />
                </span>
                Offer Letter & Sealing Statement
              </Button>
            </Link>
          </li>
        )}
        {hasPermission("ActivityLogsList") && (
          <li>
            <Link
              to="/activity-logs"
              onClick={handleCloseSidebarOnMobile}
            >
              <Button
                className={`w-100 ${activeTab === 8 ? "active" : ""}`}
                onClick={() => setActiveTab(8)}
              >
                <span className="icon">
                  <MdHistory />
                </span>
                Activity Logs
              </Button>
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
