const form = document.getElementById("loginForm");
const messageEl = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  messageEl.textContent = "Verifikasi sedang berlangsung...";
  messageEl.className = "message";

  if (!username || !password) {
    messageEl.textContent = "Silakan lengkapi semua bidang.";
    messageEl.classList.add("error");
    return;
  }

  try {
    const response = await fetch("https://dummyjson.com/users");
    if (!response.ok) throw new Error("Kesalahan koneksi server.");

    const data = await response.json();
    const users = data.users;

    console.log("Username yang diketik:", username);
    console.log("Password yang diketik:", password);
    console.log("Data Users dari API:", users);

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      localStorage.setItem("firstName", user.firstName);

      messageEl.textContent = `Koneksi berhasil! Selamat datang! ${user.firstName} 👋`;
      messageEl.classList.add("success");

      setTimeout(() => {
        window.location.href = "recipes.html";
      }, 1500);
    } else {
      messageEl.textContent = "Incorrect.";
      messageEl.classList.add("error");
    }
  } catch (error) {
    console.error(error);
    messageEl.textContent = "Kesalahan koneksi server. Silakan coba lagi.";
    messageEl.classList.add("error");
  }
});
