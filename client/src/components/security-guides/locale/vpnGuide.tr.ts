import type { VpnGuideCopy } from "./types";

export const vpnGuideTr: VpnGuideCopy = {
  metaTitle: "VPN Hizmetleri Rehberi",
  metaDescription:
    "Güvenilir bir VPN seçin. Proton VPN, Mullvad ve NymVPN: neyi korurlar, neyi çözemezler ve güvenli sır paylaşımı.",
  heroLabel: "Güvenlik rehberi",
  heroTitle: "VPN Hizmetleri Rehberi",
  heroSubtitle:
    "Güvenilir bir VPN seçmek için pratik bir rehber — neyi korurlar, neyi çözemezler ve Proton VPN, Mullvad ile NymVPN’in gizlilik odaklı kullanıcılar için neden öne çıktığı.",
  whatItDoesTitle: "VPN aslında ne yapar",
  whatItDoesBody:
    "Sanal özel ağ, cihazınız ile bir VPN sunucusu arasında şifreli bir tünel oluşturur. Cihazınızdan çıkan trafik şifrelenir; siteler sizin IP’niz yerine VPN sunucusunun IP’sini görür. Böylece ISS’nizin, kafe Wi‑Fi işletmecisinin veya aynı ağdaki birinin gözlemleyebileceği bilgi azalır.",
  benefits: [
    "Cihazınız ile VPN sunucusu arasındaki trafiği şifreler",
    "Gerçek IP’nizi ziyaret ettiğiniz sitelerden gizler",
    "Güvenilmeyen Wi‑Fi’de pasif dinlemeye karşı korur",
    "ISS düzeyinde DNS ve hedef meta veri izlemeyi azaltır",
  ],
  withoutVpnLabel: "VPN olmadan",
  withoutVpnBody:
    "Cihazınız siteyle doğrudan konuşur. Wi‑Fi işletmecisi ve ISS bağlantı meta verisini görebilir; düşmanca ağlarda trafik ele geçirilebilir.",
  withoutVpnItems: [
    "Siteler gerçek IP’yi görür",
    "ISS hedefleri ve DNS’i görür",
    "Herkese açık Wi‑Fi riski",
  ],
  withVpnLabel: "VPN ile",
  withVpnBody:
    "Trafik önce VPN sunucusuna şifreli gider. Yerel ağdaki gözlemciler hangi siteleri ziyaret ettiğinizi değil, şifreli paketleri görür.",
  withVpnItems: [
    "Siteler VPN çıkış IP’sini görür",
    "Sunucuya şifreli tünel",
    "Güvenilmeyen ağlarda daha güvenli",
  ],
  limitationsTitle: "VPN’in yapmadıkları",
  limitationsIntro: "VPN’ler yararlıdır ama sihirli bir görünmezlik pelerini değildir — özellikle sır paylaşırken.",
  limitations: [
    "Google, Facebook veya iş hesaplarında oturum açıkken sizi anonim yapmaz",
    "Oltalama, kötü amaçlı yazılım veya zayıf parolaları durdurmaz",
    "Uygulama zaten uçtan uca şifreleme kullanmıyorsa sohbet içeriğini şifrelemez",
    "Parolalar, API anahtarları veya kurtarma kodları için güvenli paylaşımın yerini tutmaz",
  ],
  limitationsCallout:
    "Tek seferlik sırlar — parolalar, tohum cümleleri, API anahtarları — için PrivateNote gibi uçtan uca şifreli paylaşım kullanın. VPN boruyu korur; e-posta, Slack veya SMS’e yapıştırdığınızı korumaz.",
  whenToUseTitle: "VPN ne zaman kullanılmalı",
  whenToUseIntro:
    "Tehdit modeliniz gerektirmedikçe 7/24 şart değildir — ama güvenilir bir VPN’in yerini hak ettiği durumlar bunlardır.",
  useCases: [
    { label: "Herkese açık Wi‑Fi", detail: "Havalimanları, oteller, kafeler" },
    { label: "Seyahat", detail: "Yabancı ağlar ve dolaşım" },
    { label: "ISS meta verisi", detail: "Ev ağı kaydını azaltır" },
    { label: "Hassas iş", detail: "Araştırma ve gazetecilik" },
  ],
  trustTitle: "Güvenilir bir VPN nasıl anlaşılır",
  trustSignals: [
    "Bağımsız denetlenmiş günlük tutmama politikası",
    "Şeffaf sahiplik ve yargı yetkisi",
    "Güçlü şifrelemeli WireGuard veya OpenVPN",
    "Açık kaynak veya yeniden üretilebilir istemci derlemeleri",
    "Dürüst meta veri ve faturalama açıklamaları",
    "«%100 anonim» pazarlama abartısı yok",
  ],
  providersTitle: "Önerilen sağlayıcılar",
  providersIntro:
    "Güvenilir ekiplerden üç gizlilik odaklı VPN — İsviçre hukuku, anonim kayıt veya mixnet yönlendirmesine göre seçin.",
  providers: {
    proton: {
      tagline: "İsviçre gizlilik hukuku · denetlenmiş günlük yok · Proton ekosistemi",
      description:
        "Proton Mail’in arkasındaki Proton AG tarafından geliştirildi. Açık kaynak uygulamalar, bağımsız denetimler, Secure Core yönlendirme ve isteğe bağlı Tor-over-VPN.",
      highlights: ["İsviçre yargı yetkisi", "Denetlenmiş günlük yok", "Ücretsiz katman", "Açık kaynak istemciler"],
      visitLabel: "Proton VPN’i ziyaret et",
    },
    mullvad: {
      tagline: "E-posta yok · yalnızca hesap numarası · nakit ve kripto",
      description:
        "Anonim hesap numaraları, sabit fiyat ve kimliğinizi abonelikten ayıran ödeme seçenekleriyle İsveç VPN’i.",
      highlights: ["E-posta ile kayıt yok", "WireGuard + OpenVPN", "Nakit ve kripto kabul", "Denetlenmiş altyapı"],
      visitLabel: "Mullvad’ı ziyaret et",
    },
    nym: {
      tagline: "Mixnet yönlendirme · standart tünelin ötesi",
      description:
        "VPN şifrelemesinin üzerine mixnet ekler — paketleri kırıp yeniden sıralayarak yalnızca IP’nizi gizlemekle kalmaz, trafik analizine de direnir.",
      highlights: [
        "WireGuard + mixnet kipleri",
        "Merkeziyetsiz yönlendirme",
        "Trafik analizine dirençli",
        "Araştırma odaklı ekip",
      ],
      visitLabel: "NymVPN’i ziyaret et",
    },
  },
  comparisonHeaders: {
    bestFor: "En uygun",
    proton: "Proton VPN",
    mullvad: "Mullvad",
    nym: "NymVPN",
  },
  comparisonRows: {
    privacyJurisdiction: {
      label: "Gizlilik yargı yetkisi",
      proton: "İsviçre",
      mullvad: "İsveç",
      nym: "Merkeziyetsiz mixnet",
    },
    signup: {
      label: "Kayıt",
      proton: "E-posta hesabı",
      mullvad: "Rastgele hesap no",
      nym: "Standart hesap",
    },
    standout: {
      label: "Öne çıkan özellik",
      proton: "Secure Core + Tor",
      mullvad: "Nakit/kripto ödeme",
      nym: "Mixnet yönlendirme",
    },
    idealUser: {
      label: "İdeal kullanıcı",
      proton: "Proton ekosistemi",
      mullvad: "Maksimum kayıt anonimliği",
      nym: "Trafik analizi direnci",
    },
  },
  ctaTitle: "VPN + PrivateNote: farklı işler",
  ctaBody:
    "VPN bağlantınızı korur. PrivateNote sırrın kendisini korur — yüklemeden önce tarayıcıda şifrelenir, bir okumadan sonra yok olur.",
  ctaButton: "Güvenli tek kullanımlık not oluştur",
  exploreOther: "Diğer rehberleri keşfet",
  allResources: "Tüm kaynaklar",
  affiliateDisclaimer:
    "Yalnızca eğitim amaçlı bir rehber. Önerilen hizmetleri kullandığınızda ortaklık bağlantılarından komisyon alabiliriz; bu ücretsiz gizlilik kaynağını desteklemeye yardımcı olur.",
  otherGuides: [
    { id: "password", title: "Parola yöneticileri" },
    { id: "messenger", title: "Güvenli mesajlaşma" },
    { id: "email", title: "Güvenli e-posta" },
    { id: "browser", title: "Gizlilik tarayıcıları" },
  ],
};
