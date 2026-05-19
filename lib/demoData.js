export const DEMO_SCENARIOS = [
  {
    id: "arjun",
    label: "Arjun Sharma — Employment Tenure Fraud",
    description: "Inflated FinTech Corp tenure by 18 months + CGPA from 7.6 to 8.9",
    badge: "🔴 High Risk",
    data: {
      full_name:"Arjun Sharma", email:"arjun.sharma@gmail.com",
      phone:"+91 98765 43210", dob:"1999-08-12", gender:"Male",
      nationality:"Indian", aadhaar:"123412341234", pan:"ARJPS1234K",
      passport:"P1234567", uan_number:"100987654321", nps_pran:"110012345678",
      job_role:"Senior Software Engineer",
      father_name:"Rajesh Sharma", mother_name:"Priya Sharma",
      marital_status:"Single", spouse_name:"",
      addresses:[
        {id:1,address:"42 Anna Nagar, Chennai",pin:"600040",state:"Tamil Nadu",type:"Rented",from:"2023-01",to:"Present",current:true},
        {id:2,address:"15 Koramangala, Bengaluru",pin:"560095",state:"Karnataka",type:"Rented",from:"2021-01",to:"2022-12",current:false},
      ],
      employment:[
        {id:1,company:"StartupX Technologies",location:"Chennai",designation:"Software Engineer",department:"Engineering",start:"2023-01",end:"",current:true,reason_leaving:"",manager_name:"Vikram Nair",manager_email:"vikram.nair@startupx.in",hr_email:"hr@startupx.in",last_salary:"85000",pf_account:"TN/CHN/12345/001"},
        {id:2,company:"FinTech Corp",location:"Bengaluru",designation:"Software Engineer",department:"Product",start:"2021-01",end:"2023-12",current:false,reason_leaving:"Better opportunity",manager_name:"Anita Desai",manager_email:"anita.desai@fintechcorp.com",hr_email:"hr@fintechcorp.com",last_salary:"65000",pf_account:"KA/BLR/67890/002"},
      ],
      education:[
        {id:1,institution:"Vellore Institute of Technology",degree:"B.Tech",specialisation:"Computer Science",year:"2021",grade:"8.9",roll_number:"19BCE1234",university:"VIT University"},
      ],
      references:[
        {id:1,employer_id:1,company:"StartupX Technologies",name:"Vikram Nair",designation:"Engineering Manager",email:"vikram.nair@startupx.in",phone:"+91 87654 32109",relationship:"Direct Manager"},
        {id:2,employer_id:1,company:"StartupX Technologies",name:"Meera Krishnan",designation:"HR Business Partner",email:"meera.k@startupx.in",phone:"+91 76543 21098",relationship:"HR"},
        {id:3,employer_id:2,company:"FinTech Corp",name:"Anita Desai",designation:"Product Manager",email:"anita.desai@fintechcorp.com",phone:"+91 98123 45678",relationship:"Direct Manager"},
        {id:4,employer_id:2,company:"FinTech Corp",name:"Rohit Mehta",designation:"Senior Engineer",email:"rohit.mehta@fintechcorp.com",phone:"+91 91234 56789",relationship:"Colleague"},
      ],
    }
  },
  {
    id: "priya",
    label: "Priya Mehta — Fake Degree Certificate",
    description: "Claimed MBA from IIM Ahmedabad — not verified by NAD",
    badge: "🔴 Critical Risk",
    data: {
      full_name:"Priya Mehta", email:"priya.mehta@gmail.com",
      phone:"+91 91234 56789", dob:"1995-03-22", gender:"Female",
      nationality:"Indian", aadhaar:"987698769876", pan:"PRYME5678L",
      passport:"P9876543", uan_number:"100123456789", nps_pran:"110098765432",
      job_role:"Product Manager",
      father_name:"Suresh Mehta", mother_name:"Kavita Mehta",
      marital_status:"Married", spouse_name:"Rahul Mehta",
      addresses:[
        {id:1,address:"101 Bandra West, Mumbai",pin:"400050",state:"Maharashtra",type:"Owned",from:"2020-06",to:"Present",current:true},
      ],
      employment:[
        {id:1,company:"TechMart India",location:"Mumbai",designation:"Senior Product Manager",department:"Product",start:"2022-04",end:"",current:true,reason_leaving:"",manager_name:"Sanjay Patel",manager_email:"sanjay.patel@techmart.in",hr_email:"hr@techmart.in",last_salary:"180000",pf_account:"MH/MUM/11111/003"},
        {id:2,company:"ConsultCo",location:"Mumbai",designation:"Business Analyst",department:"Consulting",start:"2019-06",end:"2022-03",current:false,reason_leaving:"Growth opportunity",manager_name:"Neha Shah",manager_email:"neha.shah@consultco.com",hr_email:"hr@consultco.com",last_salary:"120000",pf_account:"MH/MUM/22222/004"},
      ],
      education:[
        {id:1,institution:"IIM Ahmedabad",degree:"MBA",specialisation:"Marketing & Strategy",year:"2019",grade:"3.8 GPA",roll_number:"PGP2019MBA0234",university:"IIM Ahmedabad"},
        {id:2,institution:"University of Mumbai",degree:"B.Com",specialisation:"Finance",year:"2017",grade:"78%",roll_number:"MU2017BC4521",university:"University of Mumbai"},
      ],
      references:[
        {id:1,employer_id:1,company:"TechMart India",name:"Sanjay Patel",designation:"VP Product",email:"sanjay.patel@techmart.in",phone:"+91 98001 23456",relationship:"Direct Manager"},
        {id:2,employer_id:1,company:"TechMart India",name:"Rita Desai",designation:"HR Manager",email:"rita.desai@techmart.in",phone:"+91 98002 34567",relationship:"HR"},
        {id:3,employer_id:2,company:"ConsultCo",name:"Neha Shah",designation:"Director",email:"neha.shah@consultco.com",phone:"+91 98003 45678",relationship:"Direct Manager"},
        {id:4,employer_id:2,company:"ConsultCo",name:"Amit Kumar",designation:"Senior Analyst",email:"amit.kumar@consultco.com",phone:"+91 98004 56789",relationship:"Colleague"},
      ],
    }
  },
  {
    id: "ravi",
    label: "Ravi Kumar — Fake Company",
    description: "Previous employer does not exist in MCA21 registry",
    badge: "🔴 High Risk",
    data: {
      full_name:"Ravi Kumar", email:"ravi.kumar@gmail.com",
      phone:"+91 87654 32101", dob:"1997-11-05", gender:"Male",
      nationality:"Indian", aadhaar:"456745674567", pan:"RAVKM9012P",
      passport:"", uan_number:"100456789012", nps_pran:"",
      job_role:"Data Engineer",
      father_name:"Mohan Kumar", mother_name:"Sunita Kumar",
      marital_status:"Single", spouse_name:"",
      addresses:[
        {id:1,address:"33 Whitefield, Bengaluru",pin:"560066",state:"Karnataka",type:"Rented",from:"2022-03",to:"Present",current:true},
      ],
      employment:[
        {id:1,company:"DataFlow Analytics",location:"Bengaluru",designation:"Data Engineer",department:"Data",start:"2022-03",end:"",current:true,reason_leaving:"",manager_name:"Kiran Rao",manager_email:"kiran.rao@dataflow.in",hr_email:"hr@dataflow.in",last_salary:"95000",pf_account:"KA/BLR/33333/005"},
        {id:2,company:"Fake Corp Solutions Pvt Ltd",location:"Hyderabad",designation:"Junior Developer",department:"Tech",start:"2020-01",end:"2022-02",current:false,reason_leaving:"Company shutdown",manager_name:"XYZ Manager",manager_email:"manager@fakecorp.xyz",hr_email:"hr@fakecorp.xyz",last_salary:"45000",pf_account:"TS/HYD/99999/006"},
      ],
      education:[
        {id:1,institution:"JNTU Hyderabad",degree:"B.Tech",specialisation:"Information Technology",year:"2019",grade:"72%",roll_number:"JNTU2019IT3456",university:"JNTU"},
      ],
      references:[
        {id:1,employer_id:1,company:"DataFlow Analytics",name:"Kiran Rao",designation:"Engineering Lead",email:"kiran.rao@dataflow.in",phone:"+91 87001 23456",relationship:"Direct Manager"},
        {id:2,employer_id:1,company:"DataFlow Analytics",name:"Pooja Singh",designation:"HR Executive",email:"pooja.singh@dataflow.in",phone:"+91 87002 34567",relationship:"HR"},
        {id:3,employer_id:2,company:"Fake Corp Solutions Pvt Ltd",name:"XYZ Manager",designation:"Manager",email:"manager@fakecorp.xyz",phone:"+91 00000 00000",relationship:"Direct Manager"},
        {id:4,employer_id:2,company:"Fake Corp Solutions Pvt Ltd",name:"ABC Colleague",designation:"Developer",email:"abc@fakecorp.xyz",phone:"+91 00000 00001",relationship:"Colleague"},
      ],
    }
  },
  {
    id: "ananya",
    label: "Ananya Singh — Clean Candidate ✓",
    description: "All checks pass — no discrepancies found",
    badge: "🟢 Low Risk",
    data: {
      full_name:"Ananya Singh", email:"ananya.singh@gmail.com",
      phone:"+91 76543 21098", dob:"1998-06-15", gender:"Female",
      nationality:"Indian", aadhaar:"789078907890", pan:"ANANS3456Q",
      passport:"P3456789", uan_number:"100789012345", nps_pran:"110045678901",
      job_role:"Frontend Developer",
      father_name:"Harinder Singh", mother_name:"Gurpreet Kaur",
      marital_status:"Single", spouse_name:"",
      addresses:[
        {id:1,address:"22 Sector 15, Gurgaon",pin:"122001",state:"Haryana",type:"Rented",from:"2021-07",to:"Present",current:true},
      ],
      employment:[
        {id:1,company:"WebSolutions India",location:"Gurgaon",designation:"Frontend Developer",department:"Engineering",start:"2021-07",end:"",current:true,reason_leaving:"",manager_name:"Rahul Gupta",manager_email:"rahul.gupta@websolutions.in",hr_email:"hr@websolutions.in",last_salary:"72000",pf_account:"HR/GGN/44444/007"},
        {id:2,company:"Creative Labs",location:"Delhi",designation:"Junior Developer",department:"Tech",start:"2019-06",end:"2021-06",current:false,reason_leaving:"Better role",manager_name:"Sunita Verma",manager_email:"sunita.verma@creativelabs.in",hr_email:"hr@creativelabs.in",last_salary:"45000",pf_account:"DL/DEL/55555/008"},
      ],
      education:[
        {id:1,institution:"Delhi University",degree:"B.Sc",specialisation:"Computer Science",year:"2019",grade:"8.2 CGPA",roll_number:"DU2019CS5678",university:"University of Delhi"},
      ],
      references:[
        {id:1,employer_id:1,company:"WebSolutions India",name:"Rahul Gupta",designation:"Tech Lead",email:"rahul.gupta@websolutions.in",phone:"+91 76001 23456",relationship:"Direct Manager"},
        {id:2,employer_id:1,company:"WebSolutions India",name:"Prerna Kapoor",designation:"HR Manager",email:"prerna.kapoor@websolutions.in",phone:"+91 76002 34567",relationship:"HR"},
        {id:3,employer_id:2,company:"Creative Labs",name:"Sunita Verma",designation:"Project Manager",email:"sunita.verma@creativelabs.in",phone:"+91 76003 45678",relationship:"Direct Manager"},
        {id:4,employer_id:2,company:"Creative Labs",name:"Ajay Sharma",designation:"Senior Developer",email:"ajay.sharma@creativelabs.in",phone:"+91 76004 56789",relationship:"Colleague"},
      ],
    }
  },
  {
    id: "karthik",
    label: "Karthik Nair — Address & Identity Mismatch",
    description: "Aadhaar address doesn't match submitted address — potential identity fraud",
    badge: "🟡 Medium Risk",
    data: {
      full_name:"Karthik Nair", email:"karthik.nair@gmail.com",
      phone:"+91 94567 89012", dob:"1996-04-18", gender:"Male",
      nationality:"Indian", aadhaar:"321032103210", pan:"KARTN7890R",
      passport:"P7890123", uan_number:"100321098765", nps_pran:"110034567890",
      job_role:"DevOps Engineer",
      father_name:"Suresh Nair", mother_name:"Lakshmi Nair",
      marital_status:"Single", spouse_name:"",
      addresses:[
        {id:1,address:"14 Powai, Mumbai",pin:"400076",state:"Maharashtra",type:"Rented",from:"2022-08",to:"Present",current:true},
        {id:2,address:"7 Thiruvananthapuram",pin:"695001",state:"Kerala",type:"Family Owned",from:"2018-01",to:"2022-07",current:false},
      ],
      employment:[
        {id:1,company:"CloudBase Systems",location:"Mumbai",designation:"DevOps Engineer",department:"Infrastructure",start:"2022-08",end:"",current:true,reason_leaving:"",manager_name:"Arun Pillai",manager_email:"arun.pillai@cloudbase.in",hr_email:"hr@cloudbase.in",last_salary:"110000",pf_account:"MH/MUM/66666/009"},
        {id:2,company:"Infosys",location:"Thiruvananthapuram",designation:"Systems Engineer",department:"Technology",start:"2019-07",end:"2022-07",current:false,reason_leaving:"Relocation",manager_name:"Pradeep Kumar",manager_email:"pradeep.k@infosys.com",hr_email:"hr@infosys.com",last_salary:"68000",pf_account:"KL/TVM/77777/010"},
      ],
      education:[
        {id:1,institution:"NIT Calicut",degree:"B.Tech",specialisation:"Computer Science",year:"2019",grade:"7.9 CGPA",roll_number:"NIT2019CS1234",university:"NIT Calicut"},
      ],
      references:[
        {id:1,employer_id:1,company:"CloudBase Systems",name:"Arun Pillai",designation:"Engineering Manager",email:"arun.pillai@cloudbase.in",phone:"+91 94001 23456",relationship:"Direct Manager"},
        {id:2,employer_id:1,company:"CloudBase Systems",name:"Divya Menon",designation:"HR Business Partner",email:"divya.menon@cloudbase.in",phone:"+91 94002 34567",relationship:"HR"},
        {id:3,employer_id:2,company:"Infosys",name:"Pradeep Kumar",designation:"Senior Manager",email:"pradeep.k@infosys.com",phone:"+91 94003 45678",relationship:"Direct Manager"},
        {id:4,employer_id:2,company:"Infosys",name:"Riya Thomas",designation:"Systems Analyst",email:"riya.thomas@infosys.com",phone:"+91 94004 56789",relationship:"Colleague"},
      ],
    }
  },
  {
    id: "deepika",
    label: "Deepika Reddy — Multiple Red Flags",
    description: "Fake company + inflated salary + personal email for all references",
    badge: "🔴 Critical Risk",
    data: {
      full_name:"Deepika Reddy", email:"deepika.reddy@gmail.com",
      phone:"+91 88765 43210", dob:"1994-12-30", gender:"Female",
      nationality:"Indian", aadhaar:"654965496549", pan:"DEEPR2345S",
      passport:"", uan_number:"100654321098", nps_pran:"",
      job_role:"Marketing Manager",
      father_name:"Venkat Reddy", mother_name:"Padma Reddy",
      marital_status:"Married", spouse_name:"Anil Reddy",
      addresses:[
        {id:1,address:"56 Jubilee Hills, Hyderabad",pin:"500033",state:"Telangana",type:"Owned",from:"2021-01",to:"Present",current:true},
      ],
      employment:[
        {id:1,company:"BrandBoost Pvt Ltd",location:"Hyderabad",designation:"Marketing Manager",department:"Marketing",start:"2021-01",end:"",current:true,reason_leaving:"",manager_name:"Fake Manager",manager_email:"manager@brandboost.xyz",hr_email:"hr@brandboost.xyz",last_salary:"150000",pf_account:"TS/HYD/88888/011"},
        {id:2,company:"AdGuru Solutions",location:"Hyderabad",designation:"Marketing Executive",department:"Marketing",start:"2018-06",end:"2020-12",current:false,reason_leaving:"Better offer",manager_name:"Raj Singh",manager_email:"rajsingh@gmail.com",hr_email:"adguru.hr@gmail.com",last_salary:"45000",pf_account:"TS/HYD/99999/012"},
      ],
      education:[
        {id:1,institution:"Osmania University",degree:"MBA",specialisation:"Marketing",year:"2018",grade:"74%",roll_number:"OU2018MBA5678",university:"Osmania University"},
      ],
      references:[
        {id:1,employer_id:1,company:"BrandBoost Pvt Ltd",name:"Fake Manager",designation:"Director",email:"fakemanager123@gmail.com",phone:"+91 00000 11111",relationship:"Direct Manager"},
        {id:2,employer_id:1,company:"BrandBoost Pvt Ltd",name:"Random Person",designation:"HR",email:"randomhr456@yahoo.com",phone:"+91 00000 22222",relationship:"HR"},
        {id:3,employer_id:2,company:"AdGuru Solutions",name:"Raj Singh",designation:"Owner",email:"rajsingh@gmail.com",phone:"+91 88001 23456",relationship:"Direct Manager"},
        {id:4,employer_id:2,company:"AdGuru Solutions",name:"Priya Joshi",designation:"Executive",email:"priyajoshi@hotmail.com",phone:"+91 88002 34567",relationship:"Colleague"},
      ],
    }
  },
  {
    id: "samuel",
    label: "Samuel Thomas — Gap in Employment",
    description: "Unexplained 14-month gap between jobs — potential concealment",
    badge: "🟡 Medium Risk",
    data: {
      full_name:"Samuel Thomas", email:"samuel.thomas@gmail.com",
      phone:"+91 77654 32109", dob:"1993-07-22", gender:"Male",
      nationality:"Indian", aadhaar:"112211221122", pan:"SAMLT4567T",
      passport:"P4567890", uan_number:"100112233445", nps_pran:"110056789012",
      job_role:"Business Analyst",
      father_name:"George Thomas", mother_name:"Mary Thomas",
      marital_status:"Married", spouse_name:"Susan Thomas",
      addresses:[
        {id:1,address:"12 MG Road, Kochi",pin:"682016",state:"Kerala",type:"Owned",from:"2023-06",to:"Present",current:true},
      ],
      employment:[
        {id:1,company:"Analytics Plus",location:"Kochi",designation:"Senior Business Analyst",department:"Analytics",start:"2023-06",end:"",current:true,reason_leaving:"",manager_name:"Jacob Mathew",manager_email:"jacob.mathew@analyticsplus.in",hr_email:"hr@analyticsplus.in",last_salary:"95000",pf_account:"KL/KCH/11111/013"},
        {id:2,company:"TCS",location:"Chennai",designation:"Business Analyst",department:"Finance",start:"2018-04",end:"2022-03",current:false,reason_leaving:"Personal reasons",manager_name:"Arvind Swamy",manager_email:"arvind.swamy@tcs.com",hr_email:"hr@tcs.com",last_salary:"75000",pf_account:"TN/CHN/22222/014"},
      ],
      education:[
        {id:1,institution:"Mahatma Gandhi University",degree:"MBA",specialisation:"Finance",year:"2018",grade:"76%",roll_number:"MGU2018MBA9012",university:"MG University"},
        {id:2,institution:"Mahatma Gandhi University",degree:"B.Com",specialisation:"Accounting",year:"2015",grade:"82%",roll_number:"MGU2015BC3456",university:"MG University"},
      ],
      references:[
        {id:1,employer_id:1,company:"Analytics Plus",name:"Jacob Mathew",designation:"Director",email:"jacob.mathew@analyticsplus.in",phone:"+91 77001 23456",relationship:"Direct Manager"},
        {id:2,employer_id:1,company:"Analytics Plus",name:"Sheena Roy",designation:"HR Manager",email:"sheena.roy@analyticsplus.in",phone:"+91 77002 34567",relationship:"HR"},
        {id:3,employer_id:2,company:"TCS",name:"Arvind Swamy",designation:"Project Manager",email:"arvind.swamy@tcs.com",phone:"+91 77003 45678",relationship:"Direct Manager"},
        {id:4,employer_id:2,company:"TCS",name:"Nisha Pillai",designation:"Senior Analyst",email:"nisha.pillai@tcs.com",phone:"+91 77004 56789",relationship:"Colleague"},
      ],
    }
  },
  {
    id: "meera",
    label: "Meera Iyer — Clean Senior Candidate ✓",
    description: "15 years experience, all checks pass — strong BGV",
    badge: "🟢 Low Risk",
    data: {
      full_name:"Meera Iyer", email:"meera.iyer@gmail.com",
      phone:"+91 98001 23456", dob:"1985-09-10", gender:"Female",
      nationality:"Indian", aadhaar:"445544554455", pan:"MEERI8901U",
      passport:"P8901234", uan_number:"100445566778", nps_pran:"110078901234",
      job_role:"Engineering Manager",
      father_name:"Krishnan Iyer", mother_name:"Saraswati Iyer",
      marital_status:"Married", spouse_name:"Suresh Iyer",
      addresses:[
        {id:1,address:"8 Indiranagar, Bengaluru",pin:"560038",state:"Karnataka",type:"Owned",from:"2015-03",to:"Present",current:true},
      ],
      employment:[
        {id:1,company:"Wipro Technologies",location:"Bengaluru",designation:"Engineering Manager",department:"Engineering",start:"2018-01",end:"",current:true,reason_leaving:"",manager_name:"Aditya Birla",manager_email:"aditya.birla@wipro.com",hr_email:"hr@wipro.com",last_salary:"250000",pf_account:"KA/BLR/33344/015"},
        {id:2,company:"Accenture",location:"Bengaluru",designation:"Senior Developer",department:"Technology",start:"2012-06",end:"2017-12",current:false,reason_leaving:"Leadership opportunity",manager_name:"Priya Nambiar",manager_email:"priya.nambiar@accenture.com",hr_email:"hr@accenture.com",last_salary:"160000",pf_account:"KA/BLR/44455/016"},
      ],
      education:[
        {id:1,institution:"IIT Madras",degree:"M.Tech",specialisation:"Computer Science",year:"2010",grade:"8.7 CGPA",roll_number:"IITM2010CS0123",university:"IIT Madras"},
        {id:2,institution:"NIT Trichy",degree:"B.Tech",specialisation:"Computer Science",year:"2008",grade:"8.4 CGPA",roll_number:"NITT2008CS4567",university:"NIT Trichy"},
      ],
      references:[
        {id:1,employer_id:1,company:"Wipro Technologies",name:"Aditya Birla",designation:"VP Engineering",email:"aditya.birla@wipro.com",phone:"+91 98101 23456",relationship:"Direct Manager"},
        {id:2,employer_id:1,company:"Wipro Technologies",name:"Kavya Rao",designation:"HRBP",email:"kavya.rao@wipro.com",phone:"+91 98102 34567",relationship:"HR"},
        {id:3,employer_id:2,company:"Accenture",name:"Priya Nambiar",designation:"Senior Manager",email:"priya.nambiar@accenture.com",phone:"+91 98103 45678",relationship:"Direct Manager"},
        {id:4,employer_id:2,company:"Accenture",name:"Suresh Menon",designation:"Tech Lead",email:"suresh.menon@accenture.com",phone:"+91 98104 56789",relationship:"Colleague"},
      ],
    }
  },
  {
    id: "farhan",
    label: "Farhan Sheikh — Salary Inflation",
    description: "Claimed ₹1.8L salary — employer confirms ₹95K — 90% inflation",
    badge: "🟡 Medium Risk",
    data: {
      full_name:"Farhan Sheikh", email:"farhan.sheikh@gmail.com",
      phone:"+91 93456 78901", dob:"1997-02-14", gender:"Male",
      nationality:"Indian", aadhaar:"778877887788", pan:"FARHS5678V",
      passport:"", uan_number:"100778899001", nps_pran:"",
      job_role:"Sales Manager",
      father_name:"Rashid Sheikh", mother_name:"Fatima Sheikh",
      marital_status:"Single", spouse_name:"",
      addresses:[
        {id:1,address:"23 Park Street, Kolkata",pin:"700016",state:"West Bengal",type:"Rented",from:"2021-09",to:"Present",current:true},
      ],
      employment:[
        {id:1,company:"RetailEdge India",location:"Kolkata",designation:"Sales Manager",department:"Sales",start:"2021-09",end:"",current:true,reason_leaving:"",manager_name:"Biplab Das",manager_email:"biplab.das@retailedge.in",hr_email:"hr@retailedge.in",last_salary:"180000",pf_account:"WB/KOL/55566/017"},
        {id:2,company:"ShopNow Pvt Ltd",location:"Kolkata",designation:"Sales Executive",department:"Sales",start:"2019-03",end:"2021-08",current:false,reason_leaving:"Better package",manager_name:"Suman Roy",manager_email:"suman.roy@shopnow.in",hr_email:"hr@shopnow.in",last_salary:"65000",pf_account:"WB/KOL/66677/018"},
      ],
      education:[
        {id:1,institution:"Calcutta University",degree:"B.Com",specialisation:"Marketing",year:"2018",grade:"68%",roll_number:"CU2018BC7890",university:"University of Calcutta"},
      ],
      references:[
        {id:1,employer_id:1,company:"RetailEdge India",name:"Biplab Das",designation:"Regional Manager",email:"biplab.das@retailedge.in",phone:"+91 93001 23456",relationship:"Direct Manager"},
        {id:2,employer_id:1,company:"RetailEdge India",name:"Ankita Sen",designation:"HR Executive",email:"ankita.sen@retailedge.in",phone:"+91 93002 34567",relationship:"HR"},
        {id:3,employer_id:2,company:"ShopNow Pvt Ltd",name:"Suman Roy",designation:"Sales Manager",email:"suman.roy@shopnow.in",phone:"+91 93003 45678",relationship:"Direct Manager"},
        {id:4,employer_id:2,company:"ShopNow Pvt Ltd",name:"Raj Bose",designation:"Sales Executive",email:"raj.bose@shopnow.in",phone:"+91 93004 56789",relationship:"Colleague"},
      ],
    }
  },
  {
    id: "lakshmi",
    label: "Lakshmi Prasad — Clean Finance Candidate ✓",
    description: "CA with 8 years experience — all checks pass",
    badge: "🟢 Low Risk",
    data: {
      full_name:"Lakshmi Prasad", email:"lakshmi.prasad@gmail.com",
      phone:"+91 96789 01234", dob:"1990-11-25", gender:"Female",
      nationality:"Indian", aadhaar:"990099009900", pan:"LAKSP6789W",
      passport:"P6789012", uan_number:"100990011223", nps_pran:"110089012345",
      job_role:"Finance Manager",
      father_name:"Rama Prasad", mother_name:"Sita Prasad",
      marital_status:"Married", spouse_name:"Vijay Prasad",
      addresses:[
        {id:1,address:"45 Jubilee Hills, Hyderabad",pin:"500033",state:"Telangana",type:"Owned",from:"2019-01",to:"Present",current:true},
      ],
      employment:[
        {id:1,company:"Deloitte India",location:"Hyderabad",designation:"Finance Manager",department:"Finance",start:"2019-01",end:"",current:true,reason_leaving:"",manager_name:"Ashok Reddy",manager_email:"ashok.reddy@deloitte.com",hr_email:"hr@deloitte.com",last_salary:"220000",pf_account:"TS/HYD/77788/019"},
        {id:2,company:"KPMG India",location:"Mumbai",designation:"Senior Accountant",department:"Audit",start:"2015-06",end:"2018-12",current:false,reason_leaving:"Relocation",manager_name:"Shweta Jain",manager_email:"shweta.jain@kpmg.com",hr_email:"hr@kpmg.com",last_salary:"150000",pf_account:"MH/MUM/88899/020"},
      ],
      education:[
        {id:1,institution:"Institute of Chartered Accountants of India",degree:"CA",specialisation:"Chartered Accountancy",year:"2014",grade:"First Class",roll_number:"ICAI2014CA2345",university:"ICAI"},
        {id:2,institution:"Osmania University",degree:"B.Com",specialisation:"Accounting",year:"2011",grade:"85%",roll_number:"OU2011BC6789",university:"Osmania University"},
      ],
      references:[
        {id:1,employer_id:1,company:"Deloitte India",name:"Ashok Reddy",designation:"Partner",email:"ashok.reddy@deloitte.com",phone:"+91 96001 23456",relationship:"Direct Manager"},
        {id:2,employer_id:1,company:"Deloitte India",name:"Preethi Sharma",designation:"HR Manager",email:"preethi.sharma@deloitte.com",phone:"+91 96002 34567",relationship:"HR"},
        {id:3,employer_id:2,company:"KPMG India",name:"Shweta Jain",designation:"Director",email:"shweta.jain@kpmg.com",phone:"+91 96003 45678",relationship:"Direct Manager"},
        {id:4,employer_id:2,company:"KPMG India",name:"Rahul Mehta",designation:"Senior Auditor",email:"rahul.mehta@kpmg.com",phone:"+91 96004 56789",relationship:"Colleague"},
      ],
    }
  },
];
