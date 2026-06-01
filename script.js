// ⚠️ အရေးကြီး - သင့် Google Web App URL ကို ဒီနေရာမှာ သေချာပြန်ထည့်ပေးပါ
const GOOGLE_SHEET_API_URL = "https://script.google.com/macros/s/AKfycbyda51GpLZx2yjKEXQmcDgmPUYUIpNX9rnf6AKGukoouNbW8IAv0yabamiWll9hU1pt/exec"; 

// စာမျက်နှာ စပွင့်ပွင့်ချင်း Google Sheet ထဲက မန်ဘာတွေကို လှမ်းယူပြီး Table ထဲထည့်မည်
// (loadMembersTable is not defined in this page and has been removed to avoid startup errors)

// Menu Tab များ ပြောင်းလဲရန် လုပ်ဆောင်ချက်
function switchTab(tabId, button) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    if (button) {
        button.classList.add('active');
    }
}



// 💳 ၂။ PAGE 3 အတွက် အသင်းသားရိုက်ထည့်လိုက်သော အချက်အလက်များအတိုင်း မန်ဘာကတ်ထုတ်ပေးခြင်း
async function fetchMemberCard() {
    const inputId = document.getElementById('searchId').value.trim();
    const inputMajor = document.getElementById('searchMajor').value.trim();
    const inputRoll = document.getElementById('searchRoll').value.trim();

    // Input ကွက်လပ် ဖြစ်၊ မဖြစ် စစ်ဆေးခြင်း
    if (!inputId || !inputMajor || !inputRoll) {
        alert("ကျေးဇူးပြု၍ ရှာဖွေရန် အချက်အလက် ၃ ခုစလုံး ပြည့်စုံစွာ ဖြည့်စွက်ပါ!");
        return;
    }

    try {
        const button = document.querySelector(".form-section button");
        const originalBtnText = button.innerText;
        button.innerText = "ရှာဖွေနေပါသည်...";
        button.disabled = true;

        // Google Redirect Block မဖြစ်အောင် redirect: "follow" စနစ် သုံးထားသည်
        const response = await fetch(GOOGLE_SHEET_API_URL, { method: "GET", redirect: "follow" });
        const memberDatabase = await response.json();

        button.innerText = originalBtnText;
        button.disabled = false;

        // 🔍 ဒေတာ ကိုက်ညီမှု ရှိ၊ မရှိ လိုက်ရှာခြင်း (စာလုံးအကြီးအသေး မခွဲခြားဘဲ ရှာနိုင်အောင် ပြင်ထားသည်)
        const foundMember = memberDatabase.find(member => {
            const sId = String(member.id).trim();
            const sMajor = String(member.major).toLowerCase().trim();
            const sRoll = String(member.roll).trim();

            return sId === inputId && sMajor === inputMajor.toLowerCase() && sRoll === inputRoll;
        });

        if (foundMember) {
            // ကတ်ပြားပေါ်တွင် ဒေတာများ ပြသခြင်း
            document.getElementById('cardName').innerText = foundMember.name || "-";
            document.getElementById('cardPhone').innerText = foundMember.phone || "-";
            document.getElementById('cardIdText').innerText = "HTU-" + foundMember.id;
            document.getElementById('cardMajor').innerText = foundMember.major || "-";
            document.getElementById('cardRoll').innerText = foundMember.roll || "-";
            document.getElementById('cardStart').innerText = foundMember.startDate || "-";
            document.getElementById('cardEnd').innerText = foundMember.endDate || "-";

            // ကတ်ပြားကို ဖော်ပြပါ
            document.getElementById('memberCard').style.display = 'block';
            document.getElementById('memberCard').scrollIntoView({ behavior: 'smooth' });
        } else {
            alert("အသင်းဝင်အချက်အလက် ရှာမတွေ့ပါ။ ID (0001)၊ မေဂျာ (EC) နှင့် ခုံနံပါတ် (1) မှန်ကန်စွာ ပြန်ရိုက်ပေးပါဗျာ။");
            document.getElementById('memberCard').style.display = 'none';
        }
    } catch (error) {
        console.error("Error fetching card:", error);
        alert("ဒေတာဆွဲယူ၍ မရနိုင်ပါ။ အင်တာနက် သို့မဟုတ် Google Sheet Permission ကို ပြန်စစ်ပေးပါဗျာ။");
        const button = document.querySelector(".form-section button");
        if(button) {
            button.innerText = "Enter";
            button.disabled = false;
        }
    }
}
