trackPageView({ key: "page_prayer_request", label: "Trang gửi lời cầu nguyện", kind: "page" });

const prayerForm = document.querySelector("#prayerRequestForm");
const prayerName = document.querySelector("#prayerName");
const prayerTitle = document.querySelector("#prayerTitle");
const prayerText = document.querySelector("#prayerText");
const anonymousToggle = document.querySelector("#anonymousToggle");
const prayerMessage = document.querySelector("#prayerRequestMessage");
let isAnonymous = false;

setupBackLink("index.html", "Trang chá»§", { useStored: false, useHistory: false });

anonymousToggle.addEventListener("click", () => {
  isAnonymous = !isAnonymous;
  anonymousToggle.classList.toggle("active", isAnonymous);
  anonymousToggle.setAttribute("aria-pressed", String(isAnonymous));
  prayerName.disabled = isAnonymous;
  prayerName.value = isAnonymous ? "Anonymous" : "";
});

prayerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = prayerForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  prayerMessage.textContent = "Äang gá»­i lá»i cáº§u nguyá»‡n...";

  try {
    await submitPrayerRequest({
      displayName: prayerName.value.trim(),
      prayerTitle: prayerTitle.value.trim(),
      anonymous: isAnonymous,
      prayerText: prayerText.value.trim(),
    });
    prayerForm.reset();
    isAnonymous = false;
    anonymousToggle.classList.remove("active");
    anonymousToggle.setAttribute("aria-pressed", "false");
    prayerName.disabled = false;
    prayerMessage.textContent =
      "Lá»i cáº§u nguyá»‡n cá»§a báº¡n sáº½ Ä‘Æ°á»£c gá»­i Ä‘áº¿n ban quáº£n trá»‹ Ä‘á»ƒ duyá»‡t trÆ°á»›c khi hiá»ƒn thá»‹ trÃªn website.";
  } catch (error) {
    prayerMessage.textContent = error.message;
  } finally {
    submitButton.disabled = false;
  }
});


