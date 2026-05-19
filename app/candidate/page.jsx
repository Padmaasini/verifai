"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DEMO_SCENARIOS } from "../../lib/demoData.js";

const STEPS = ["Personal", "Family", "Addresses", "Employment", "Education", "References", "Documents", "Review"];
const inp = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white";
const lbl = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1";

const newAddr = () => ({ id: Date.now(), address:"", pin:"", state:"", type:"Rented", from:"", to:"", current:false });
const newEmp  = () => ({ id: Date.now(), company:"", location:"", designation:"", department:"", start:"", end:"", current:false, reason_leaving:"", manager_name:"", manager_email:"", hr_email:"", last_salary:"", pf_account:"" });
const newEdu  = () => ({ id: Date.now(), institution:"", degree:"", specialisation:"", year:"", grade:"", roll_number:"", university:"" });
const newRef  = (eid, co) => ({ id: Date.now(), employer_id:eid, company:co, name:"", designation:"", email:"", phone:"", relationship:"" });

export default function CandidatePage() {
  const router = useRouter();
  const [step, setStep]         = useState(0);
  const [loading, setLoading]   = useState(false);
  const [showScenarios, setShowScenarios] = useState(false);
  const [personal, setPers]     = useState({ full_name:"",email:"",phone:"",dob:"",gender:"",nationality:"Indian",aadhaar:"",pan:"",passport:"",uan_number:"",nps_pran:"",job_role:"" });
  const [family, setFam]        = useState({ father_name:"",mother_name:"",marital_status:"Single",spouse_name:"" });
  const [addresses, setAddr]    = useState([newAddr()]);
  const [employment, setEmp]    = useState([newEmp()]);
  const [education, setEdu]     = useState([newEdu()]);
  const [references, setRefs]   = useState([]);
  const [docs, setDocs]         = useState({});

  const p = (k,v) => setPers(f=>({...f,[k]:v}));
  const f = (k,v) => setFam(f=>({...f,[k]:v}));

  function loadScenario(scenario) {
    const d = scenario.data;
    setPers({ full_name:d.full_name, email:d.email, phone:d.phone, dob:d.dob, gender:d.gender, nationality:d.nationality, aadhaar:d.aadhaar, pan:d.pan, passport:d.passport, uan_number:d.uan_number, nps_pran:d.nps_pran, job_role:d.job_role });
    setFam({ father_name:d.father_name, mother_name:d.mother_name, marital_status:d.marital_status, spouse_name:d.spouse_name });
    setAddr(d.addresses);
    setEmp(d.employment);
    setEdu(d.education);
    setRefs(d.references);
    setShowScenarios(false);
    alert(`✓ Loaded: ${scenario.label}\n\n${scenario.description}\n\nExpected result: ${scenario.badge}`);
  }

  function updEmp(idx,k,v) {
    setEmp(prev => {
      const u = prev.map((e,i)=>i===idx?{...e,[k]:v}:e);
      setRefs(r=>r.map(x=>x.employer_id===u[idx].id?{...x,company:u[idx].company}:x));
      return u;
    });
  }
  function addEmp() {
    if (employment.length>=5) return alert("Maximum 5 employers.");
    const e = newEmp();
    setEmp(p=>[...p,e]);
    setRefs(p=>[...p, newRef(e.id,""), newRef(e.id,"")]);
  }
  function remEmp(idx) {
    const id = employment[idx].id;
    setEmp(p=>p.filter((_,i)=>i!==idx));
    setRefs(p=>p.filter(r=>r.employer_id!==id));
  }
  function updRef(idx,k,v) { setRefs(p=>p.map((r,i)=>i===idx?{...r,[k]:v}:r)); }
  const refsByEmp = employment.map(e=>({ emp:e, refs:references.filter(r=>r.employer_id===e.id) }));

  async function handleSubmit() {
    setLoading(true);
    try {
      const res = await fetch("/api/bgv/start", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ ...personal, ...family, addresses, employment, education, references }),
      });
      const data = await res.json();
      if (data.success) router.push(`/candidate/status?id=${data.candidateId}`);
      else { alert("Something went wrong: " + data.error); setLoading(false); }
    } catch(e) { alert("Network error."); setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      {/* Header */}
      <div className="text-center mb-4">
        <a href="/" className="text-3xl font-bold text-[#14532d]">Verif<span className="text-[#16a34a]">AI</span></a>
        <p className="text-gray-500 text-sm mt-1">Let's Get You Onboarded! 🚀</p>
      </div>

      {/* Demo scenario selector */}
      <div className="w-full max-w-3xl mb-4 relative">
        <button onClick={()=>setShowScenarios(!showScenarios)}
          className="w-full px-5 py-3 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 transition flex items-center justify-between">
          <span>⚡ Load Demo Scenario</span>
          <span>{showScenarios ? "▲" : "▼"}</span>
        </button>
        {showScenarios && (
          <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
            {DEMO_SCENARIOS.map(s => (
              <button key={s.id} onClick={()=>loadScenario(s)}
                className="w-full text-left px-5 py-4 hover:bg-green-50 transition border-b border-gray-50 last:border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{s.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.description}</p>
                  </div>
                  <span className="text-xs font-bold ml-4 shrink-0">{s.badge}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="w-full max-w-3xl mb-5">
        <div className="flex gap-1 mb-1.5">
          {STEPS.map((_,i)=><div key={i} className={`flex-1 h-1.5 rounded-full ${i<=step?"bg-[#16a34a]":"bg-gray-200"}`}/>)}
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>Step {step+1} of {STEPS.length}</span>
          <span className="font-semibold text-[#16a34a]">{STEPS[step]}</span>
        </div>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-8">

        {step===0 && <div>
          <h2 className="text-lg font-bold text-[#14532d] mb-4">Personal Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className={lbl}>Full Name (as on Aadhaar) *</label><input className={inp} value={personal.full_name} onChange={e=>p("full_name",e.target.value)} /></div>
            <div><label className={lbl}>Date of Birth *</label><input type="date" className={inp} value={personal.dob} onChange={e=>p("dob",e.target.value)} /></div>
            <div><label className={lbl}>Gender</label><select className={inp} value={personal.gender} onChange={e=>p("gender",e.target.value)}><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></select></div>
            <div><label className={lbl}>Email *</label><input type="email" className={inp} value={personal.email} onChange={e=>p("email",e.target.value)} /></div>
            <div><label className={lbl}>Phone *</label><input className={inp} value={personal.phone} onChange={e=>p("phone",e.target.value)} /></div>
            <div><label className={lbl}>Nationality</label><input className={inp} value={personal.nationality} onChange={e=>p("nationality",e.target.value)} /></div>
            <div><label className={lbl}>Job Role Applied For</label><input className={inp} value={personal.job_role} onChange={e=>p("job_role",e.target.value)} /></div>
            <div><label className={lbl}>Aadhaar Number *</label><input className={inp} value={personal.aadhaar} onChange={e=>p("aadhaar",e.target.value)} maxLength={12} /></div>
            <div><label className={lbl}>PAN Number *</label><input className={inp} value={personal.pan} onChange={e=>p("pan",e.target.value.toUpperCase())} maxLength={10} /></div>
            <div><label className={lbl}>Passport Number</label><input className={inp} value={personal.passport} onChange={e=>p("passport",e.target.value.toUpperCase())} /></div>
            <div><label className={lbl}>UAN Number (EPFO)</label><input className={inp} value={personal.uan_number} onChange={e=>p("uan_number",e.target.value)} /></div>
            <div><label className={lbl}>NPS PRAN Number</label><input className={inp} value={personal.nps_pran} onChange={e=>p("nps_pran",e.target.value)} /></div>
          </div>
        </div>}

        {step===1 && <div>
          <h2 className="text-lg font-bold text-[#14532d] mb-4">Family Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={lbl}>Father's Full Name *</label><input className={inp} value={family.father_name} onChange={e=>f("father_name",e.target.value)} /></div>
            <div><label className={lbl}>Mother's Full Name *</label><input className={inp} value={family.mother_name} onChange={e=>f("mother_name",e.target.value)} /></div>
            <div><label className={lbl}>Marital Status</label><select className={inp} value={family.marital_status} onChange={e=>f("marital_status",e.target.value)}><option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option></select></div>
            {family.marital_status==="Married"&&<div><label className={lbl}>Spouse Name</label><input className={inp} value={family.spouse_name} onChange={e=>f("spouse_name",e.target.value)} /></div>}
          </div>
        </div>}

        {step===2 && <div>
          <h2 className="text-lg font-bold text-[#14532d] mb-1">Address History — Last 5 Years</h2>
          <p className="text-xs text-gray-400 mb-4">Add all addresses you have lived at in the last 5 years.</p>
          <div className="space-y-4">
            {addresses.map((a,i)=><div key={a.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
              <div className="flex justify-between mb-3">
                <p className="text-sm font-bold text-[#14532d]">{i===0?"Current Address":`Previous Address ${i}`}</p>
                {i>0&&<button onClick={()=>setAddr(x=>x.filter((_,j)=>j!==i))} className="text-red-400 text-xs">Remove</button>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2"><label className={lbl}>Full Address *</label><textarea className={inp} rows={2} value={a.address} onChange={e=>setAddr(x=>x.map((y,j)=>j===i?{...y,address:e.target.value}:y))} /></div>
                <div><label className={lbl}>PIN Code</label><input className={inp} value={a.pin} maxLength={6} onChange={e=>setAddr(x=>x.map((y,j)=>j===i?{...y,pin:e.target.value}:y))} /></div>
                <div><label className={lbl}>State</label><input className={inp} value={a.state} onChange={e=>setAddr(x=>x.map((y,j)=>j===i?{...y,state:e.target.value}:y))} /></div>
                <div><label className={lbl}>Type</label><select className={inp} value={a.type} onChange={e=>setAddr(x=>x.map((y,j)=>j===i?{...y,type:e.target.value}:y))}><option>Rented</option><option>Owned</option><option>Company Provided</option><option>Family Owned</option></select></div>
                <div><label className={lbl}>From</label><input type="month" className={inp} value={a.from} onChange={e=>setAddr(x=>x.map((y,j)=>j===i?{...y,from:e.target.value}:y))} /></div>
                <div><label className={lbl}>To (blank if current)</label><input type="month" className={inp} value={a.to==="Present"?"":a.to} onChange={e=>setAddr(x=>x.map((y,j)=>j===i?{...y,to:e.target.value}:y))} /></div>
              </div>
            </div>)}
          </div>
          {addresses.length<6&&<button onClick={()=>setAddr(a=>[...a,newAddr()])} className="mt-4 text-sm text-[#16a34a] font-semibold hover:underline">+ Add Another Address</button>}
        </div>}

        {step===3 && <div>
          <h2 className="text-lg font-bold text-[#14532d] mb-1">Employment History</h2>
          <p className="text-xs text-gray-400 mb-4">Add all previous employers (max 5). 2 references per employer.</p>
          <div className="space-y-5">
            {employment.map((e,i)=><div key={e.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
              <div className="flex justify-between mb-3">
                <p className="text-sm font-bold text-[#14532d]">Employer {i+1} {e.current?"(Current)":""}</p>
                {employment.length>1&&<button onClick={()=>remEmp(i)} className="text-red-400 text-xs">Remove</button>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2"><label className={lbl}>Company Name *</label><input className={inp} value={e.company} onChange={x=>updEmp(i,"company",x.target.value)} /></div>
                <div><label className={lbl}>Location</label><input className={inp} value={e.location} onChange={x=>updEmp(i,"location",x.target.value)} /></div>
                <div><label className={lbl}>Department</label><input className={inp} value={e.department} onChange={x=>updEmp(i,"department",x.target.value)} /></div>
                <div className="col-span-2"><label className={lbl}>Designation *</label><input className={inp} value={e.designation} onChange={x=>updEmp(i,"designation",x.target.value)} /></div>
                <div><label className={lbl}>Start Date *</label><input type="month" className={inp} value={e.start} onChange={x=>updEmp(i,"start",x.target.value)} /></div>
                <div><label className={lbl}>End Date</label><input type="month" className={inp} value={e.current?"":e.end} onChange={x=>updEmp(i,"end",x.target.value)} disabled={e.current} /></div>
                <div className="col-span-2 flex items-center gap-2"><input type="checkbox" checked={e.current} onChange={x=>updEmp(i,"current",x.target.checked)} /><label className="text-sm text-gray-600">This is my current employer</label></div>
                <div><label className={lbl}>Reason for Leaving</label><input className={inp} value={e.reason_leaving} onChange={x=>updEmp(i,"reason_leaving",x.target.value)} disabled={e.current} /></div>
                <div><label className={lbl}>Last Salary (₹/month)</label><input className={inp} type="number" value={e.last_salary} onChange={x=>updEmp(i,"last_salary",x.target.value)} /></div>
                <div><label className={lbl}>Manager Name</label><input className={inp} value={e.manager_name} onChange={x=>updEmp(i,"manager_name",x.target.value)} /></div>
                <div><label className={lbl}>Manager Email</label><input className={inp} value={e.manager_email} onChange={x=>updEmp(i,"manager_email",x.target.value)} /></div>
                <div><label className={lbl}>HR Email</label><input className={inp} value={e.hr_email} onChange={x=>updEmp(i,"hr_email",x.target.value)} /></div>
                <div><label className={lbl}>PF Account Number</label><input className={inp} value={e.pf_account} onChange={x=>updEmp(i,"pf_account",x.target.value)} /></div>
              </div>
            </div>)}
          </div>
          {employment.length<5&&<button onClick={addEmp} className="mt-4 text-sm text-[#16a34a] font-semibold hover:underline">+ Add Another Employer</button>}
        </div>}

        {step===4 && <div>
          <h2 className="text-lg font-bold text-[#14532d] mb-4">Education</h2>
          <div className="space-y-4">
            {education.map((e,i)=><div key={e.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
              <div className="flex justify-between mb-3">
                <p className="text-sm font-bold text-[#14532d]">Qualification {i+1}</p>
                {education.length>1&&<button onClick={()=>setEdu(x=>x.filter((_,j)=>j!==i))} className="text-red-400 text-xs">Remove</button>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2"><label className={lbl}>Institution Name *</label><input className={inp} value={e.institution} onChange={x=>setEdu(d=>d.map((y,j)=>j===i?{...y,institution:x.target.value}:y))} /></div>
                <div><label className={lbl}>Degree *</label><input className={inp} value={e.degree} onChange={x=>setEdu(d=>d.map((y,j)=>j===i?{...y,degree:x.target.value}:y))} /></div>
                <div><label className={lbl}>Specialisation</label><input className={inp} value={e.specialisation} onChange={x=>setEdu(d=>d.map((y,j)=>j===i?{...y,specialisation:x.target.value}:y))} /></div>
                <div><label className={lbl}>University / Board</label><input className={inp} value={e.university} onChange={x=>setEdu(d=>d.map((y,j)=>j===i?{...y,university:x.target.value}:y))} /></div>
                <div><label className={lbl}>Year of Passing *</label><input className={inp} value={e.year} maxLength={4} onChange={x=>setEdu(d=>d.map((y,j)=>j===i?{...y,year:x.target.value}:y))} /></div>
                <div><label className={lbl}>CGPA / Percentage *</label><input className={inp} value={e.grade} onChange={x=>setEdu(d=>d.map((y,j)=>j===i?{...y,grade:x.target.value}:y))} /></div>
                <div><label className={lbl}>Roll Number</label><input className={inp} value={e.roll_number} onChange={x=>setEdu(d=>d.map((y,j)=>j===i?{...y,roll_number:x.target.value}:y))} /></div>
              </div>
            </div>)}
          </div>
          <button onClick={()=>setEdu(e=>[...e,newEdu()])} className="mt-4 text-sm text-[#16a34a] font-semibold hover:underline">+ Add Another Qualification</button>
        </div>}

        {step===5 && <div>
          <h2 className="text-lg font-bold text-[#14532d] mb-1">Professional References</h2>
          <p className="text-xs text-gray-400 mb-4">2 references per employer — one manager and one colleague or HR.</p>
          {refsByEmp.length===0?<p className="text-gray-400 text-sm">Please add employment history first.</p>:
          <div className="space-y-6">
            {refsByEmp.map(({emp,refs})=><div key={emp.id}>
              <p className="text-sm font-bold text-[#14532d] mb-3 bg-green-50 px-3 py-2 rounded-lg">{emp.company||"Employer (unnamed)"}</p>
              <div className="space-y-4">
                {refs.map((ref,ri)=>{
                  const gi=references.findIndex(r=>r.id===ref.id);
                  return <div key={ref.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-3">Reference {ri+1}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={lbl}>Full Name *</label><input className={inp} value={ref.name} onChange={e=>updRef(gi,"name",e.target.value)} /></div>
                      <div><label className={lbl}>Designation *</label><input className={inp} value={ref.designation} onChange={e=>updRef(gi,"designation",e.target.value)} /></div>
                      <div><label className={lbl}>Work Email *</label><input className={inp} value={ref.email} onChange={e=>updRef(gi,"email",e.target.value)} /></div>
                      <div><label className={lbl}>Phone</label><input className={inp} value={ref.phone} onChange={e=>updRef(gi,"phone",e.target.value)} /></div>
                      <div className="col-span-2"><label className={lbl}>Relationship</label>
                        <select className={inp} value={ref.relationship} onChange={e=>updRef(gi,"relationship",e.target.value)}>
                          <option value="">Select</option><option>Direct Manager</option><option>HR</option><option>Senior Colleague</option><option>Team Lead</option><option>Director</option>
                        </select>
                      </div>
                    </div>
                  </div>;
                })}
              </div>
            </div>)}
          </div>}
        </div>}

        {step===6 && <div>
          <h2 className="text-lg font-bold text-[#14532d] mb-1">Document Upload</h2>
          <p className="text-xs text-gray-400 mb-4">Upload all required documents. PDF, JPG, PNG accepted.</p>
          <div className="space-y-2">
            {[["aadhaar","Aadhaar Card"],["pan","PAN Card"],["passport","Passport"],["payslip_1","Latest Payslip"],["payslip_2","Payslip — 2 months ago"],["payslip_3","Payslip — 3 months ago"],["degree_cert","Degree Certificate(s)"],["relieving_letter","Relieving Letter(s)"],["bank_statement","Bank Statement (3 months)"],["address_proof","Address Proof"],["photograph","Recent Photograph"]].map(([key,label])=>(
              <div key={key} className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3 bg-gray-50">
                <div><p className="text-sm font-semibold text-gray-700">{label}</p>{docs[key]&&<p className="text-xs text-green-600">✓ {docs[key].name}</p>}</div>
                <label className="cursor-pointer px-3 py-1.5 bg-[#16a34a] text-white text-xs rounded-lg hover:bg-[#14532d] transition">
                  {docs[key]?"Change":"Upload"}
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={e=>{if(e.target.files[0])setDocs(d=>({...d,[key]:e.target.files[0]}));}} />
                </label>
              </div>
            ))}
          </div>
        </div>}

        {step===7 && <div>
          <h2 className="text-lg font-bold text-[#14532d] mb-4">Review & Submit</h2>
          <div className="space-y-3 text-sm">
            <RS title="Personal"><RR l="Name" v={personal.full_name}/><RR l="Email" v={personal.email}/><RR l="Aadhaar" v={personal.aadhaar?"****"+personal.aadhaar.slice(-4):"—"}/><RR l="PAN" v={personal.pan}/><RR l="Role" v={personal.job_role}/></RS>
            <RS title="Family"><RR l="Father" v={family.father_name}/><RR l="Mother" v={family.mother_name}/><RR l="Status" v={family.marital_status}/></RS>
            <RS title={`Addresses (${addresses.length})`}>{addresses.map((a,i)=><RR key={i} l={i===0?"Current":`Prev ${i}`} v={`${a.address}, ${a.state}`}/>)}</RS>
            <RS title={`Employment (${employment.length})`}>{employment.map((e,i)=><RR key={i} l={e.company} v={`${e.designation} · ${e.start}–${e.current?"Present":e.end}`}/>)}</RS>
            <RS title={`Education (${education.length})`}>{education.map((e,i)=><RR key={i} l={e.degree} v={`${e.institution} · ${e.year} · ${e.grade}`}/>)}</RS>
            <RS title={`References (${references.length})`}>{references.map((r,i)=><RR key={i} l={r.name||`Ref ${i+1}`} v={`${r.designation} @ ${r.company}`}/>)}</RS>
          </div>
          <div className="mt-5 bg-green-50 border border-green-100 rounded-xl p-4">
            <p className="text-xs text-gray-500">By submitting, I declare all information provided is true and accurate. I consent to VerifAI conducting a background verification.</p>
          </div>
        </div>}

        <div className="flex justify-between mt-8">
          <button onClick={()=>setStep(s=>Math.max(0,s-1))} className={`px-5 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 ${step===0?"invisible":""}`}>← Back</button>
          {step<STEPS.length-1
            ?<button onClick={()=>setStep(s=>s+1)} className="px-6 py-2 bg-[#16a34a] text-white rounded-lg text-sm font-semibold hover:bg-[#14532d] transition">Next →</button>
            :<button onClick={handleSubmit} disabled={loading} className="px-6 py-2 bg-[#16a34a] text-white rounded-lg text-sm font-semibold hover:bg-[#14532d] disabled:opacity-50">{loading?"Submitting...":"Submit for Verification ✓"}</button>
          }
        </div>
      </div>
    </div>
  );
}

function RS({title,children}){return <div className="bg-gray-50 rounded-xl p-4"><p className="text-xs font-bold text-[#14532d] uppercase tracking-wide mb-2">{title}</p><div className="space-y-1">{children}</div></div>;}
function RR({l,v}){return <div className="flex gap-2 text-sm"><span className="w-32 text-gray-400 shrink-0">{l}:</span><span className="text-gray-700 font-medium truncate">{v||"—"}</span></div>;}
