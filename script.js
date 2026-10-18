
"use strict";

$(document).ready(function () {
    // =========================================
    // 1. DATA DUMMY GUNUNG
    // =========================================
    const daftarGunung = [
        {
            id: 1,
            nama: "Gunung Gede",
            lokasi: "Cianjur, Jawa Barat",
            ketinggian: 2958
        },
        {
            id: 2,
            nama: "Gunung Pangrango",
            lokasi: "Jawa Barat",
            ketinggian: 3019
        },
        {
            id: 3,
            nama: "Gunung Papandayan",
            lokasi: "Garut, Jawa Barat",
            ketinggian: 2665
        }
    ];

    // Array untuk menyimpan simulasi pendaftaran selama halaman terbuka.
    const daftarPendaftaran = [];

    // =========================================
    // 2. FUNGSI RENDER DATA GUNUNG
    // JavaScript murni: DOM, perulangan, kondisi
    // =========================================
    function tampilkanGunung(data) {
        const tbody = document.getElementById("daftarGunung");
        const jumlahGunung = document.getElementById("jumlahGunung");

        // Halaman lain tidak mempunyai tabel ini.
        if (!tbody || !jumlahGunung) {
            return;
        }

        // Bersihkan isi tabel sebelumnya.
        tbody.replaceChildren();

        if (data.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = 4;
            cell.className = "text-center";
            cell.textContent = "Data gunung tidak ditemukan.";

            row.appendChild(cell);
            tbody.appendChild(row);
        } else {
            for (let i = 0; i < data.length; i++) {
                const gunung = data[i];
                const row = document.createElement("tr");

                const nomor = document.createElement("td");
                nomor.textContent = i + 1;

                const nama = document.createElement("td");
                nama.textContent = gunung.nama;

                const lokasi = document.createElement("td");
                lokasi.textContent = gunung.lokasi;

                const ketinggian = document.createElement("td");
                ketinggian.textContent =
                    gunung.ketinggian.toLocaleString("id-ID") + " mdpl";

                row.append(nomor, nama, lokasi, ketinggian);
                tbody.appendChild(row);
            }
        }

        jumlahGunung.textContent = data.length;
    }

    // =========================================
    // 3. FUNGSI PENCARIAN GUNUNG
    // =========================================
    function cariGunung(kataKunci) {
        const kata = kataKunci.toLowerCase().trim();

        return daftarGunung.filter(function (gunung) {
            return (
                gunung.nama.toLowerCase().includes(kata) ||
                gunung.lokasi.toLowerCase().includes(kata)
            );
        });
    }

    // Render awal hanya jika tabel tersedia.
    tampilkanGunung(daftarGunung);

    // =========================================
    // 4. EVENT PENCARIAN DENGAN JQUERY
    // =========================================
    $("#cariGunung").on("input", function () {
        const hasil = cariGunung($(this).val());
        tampilkanGunung(hasil);
    });

    $("#resetCari").on("click", function () {
        $("#cariGunung").val("");
        tampilkanGunung(daftarGunung);
    });

    // =========================================
    // 5. EFEK SLIDE TOGGLE DENGAN JQUERY
    // =========================================
    $("#tombolInfo").on("click", function () {
        const tombol = $(this);

        $("#panelInfo").stop(true, true).slideToggle(300, function () {
            const terlihat = $(this).is(":visible");

            tombol.text(
                terlihat ? "Sembunyikan Informasi" : "Tampilkan Informasi"
            );

            tombol.attr("aria-expanded", String(terlihat));
        });
    });

    // =========================================
    // 6. VALIDASI FORMULIR PENDAKIAN
    // =========================================
    $("#formPendakian").on("submit", function (event) {
        event.preventDefault();

        const nama = $("#namaPendaki").val().trim();
        const email = $("#emailPendaki").val().trim();
        const gunung = $("#pilihanGunung").val();
        const tanggal = $("#tanggalPendakian").val();
        const jumlah = Number($("#jumlahPeserta").val());

        let pesanError = "";

        if (!nama || !email || !gunung || !tanggal || !$("#jumlahPeserta").val()) {
            pesanError = "Semua kolom wajib harus diisi.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            pesanError = "Masukkan alamat email yang valid.";
        } else if (!Number.isInteger(jumlah) || jumlah < 1) {
            pesanError = "Jumlah peserta harus berupa bilangan bulat minimal 1.";
        } else {
            // Bandingkan tanggal lokal dalam format YYYY-MM-DD.
            const sekarang = new Date();
            const tahun = sekarang.getFullYear();
            const bulan = String(sekarang.getMonth() + 1).padStart(2, "0");
            const hari = String(sekarang.getDate()).padStart(2, "0");
            const tanggalHariIni = `${tahun}-${bulan}-${hari}`;

            if (tanggal < tanggalHariIni) {
                pesanError = "Tanggal pendakian tidak boleh di masa lalu.";
            }
        }

        if (pesanError) {
            tampilkanPesan(pesanError, "danger");
            return;
        }

        // Data hanya disimpan sementara di memori browser.
        const pendaftaran = {
            id: Date.now(),
            nama: nama,
            email: email,
            gunung: gunung,
            tanggal: tanggal,
            jumlah: jumlah,
            catatan: $("#catatan").val().trim()
        };

        daftarPendaftaran.push(pendaftaran);

        tampilkanPesan(
            "Pendaftaran simulasi berhasil untuk " + pendaftaran.nama +
            ". Total pendaftaran pada sesi ini: " + daftarPendaftaran.length + ".",
            "success"
        );

        console.log("Data pendaftaran dummy:", daftarPendaftaran);

        this.reset();
    });

    // =========================================
    // 7. NOTIFIKASI DENGAN EFEK FADE IN
    // =========================================
    function tampilkanPesan(pesan, jenis) {
        const areaPesan = $("#pesanPendaftaran");

        areaPesan
            .stop(true, true)
            .removeClass("alert-success alert-danger")
            .addClass("alert-" + jenis)
            .text(pesan)
            .hide()
            .fadeIn(300);
    }

    // Sembunyikan pesan lama ketika form di-reset.
    $("#formPendakian").on("reset", function () {
        $("#pesanPendaftaran").stop(true, true).hide().text("");
    });
});
