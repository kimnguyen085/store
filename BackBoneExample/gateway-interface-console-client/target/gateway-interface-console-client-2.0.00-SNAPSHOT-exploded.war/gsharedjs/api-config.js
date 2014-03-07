window.gapi_config = {

	// roles : {
		// investor : "Investor",
		// adviser : "Adviser"
	// },

    loginUrl: "/j_acegi_security_check",
    logoutUrl: "/j_spring_security_logout",
//    loginDetailsUrl: "/logindetails",

	baseApiUrl: "/gatewayinterfaceconsole",
	ebmsMessagesUrl: "/ebmsmessages",
	dailySummarrUrl: "/summary",
	ebmsMessagePartsUrl: "/ebmsmessageparts",
	messageTransactionsUrl: "/messagetransactions",
	messageDocumentUrl: "/messagedocuments",
	messageLogsUrl: "/messagelogs",

	ebmsMessageRawUrl: "/mshebmsmessages", // these two URLs are funny...
	ebmsMessageSearchUrl: "/ebmsmessages/singlesearch",

	errorDetailsesUrl: "/errordetailses",

	/* superstreamparticipants Product and Fund */
	participantUrl: "/superstreamparticipants",
	fundRegisterUrl: "/fundregisterdetailses",
	fundUrl: "/funds",
	productUrl: "/products",
	sourceUrl: "/sources",
	targetUrl: "/targets",

    /* ebms message header for input fields in outgoing response sender tab */
    ebmsMessageHeaderAttributeNamesUrl: "/ebmsmessages/ebmsMessageHeaderAttributeNames",

    /* send outgoing response to GI */
    sendOutgoingResponseUrl:"/ebmsmessages/sendOutgoingResponse",

    /*Account*/
    userAccountsUrl : "/useraccounts",
    changePassword : "/useraccounts/changepassword",

    /*Login details*/
    loginDetailsUrl: "/useraccounts/details",

	retryDelay: 100, // miliseconds
	maxRetryCounts : 100

};