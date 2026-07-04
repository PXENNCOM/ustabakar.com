import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  ShieldCheck, 
  FileText, 
  MapPin, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  Scale,
  AlertTriangle,
  Lock,
  RefreshCw
} from 'lucide-react';

import Header from '../../components/header/index'; 
import Footer from '../../components/footer/index';

export default function InfoHubPage() {
  const [activeTab, setActiveTab] = useState('hakkimizda');

  const menuItems = [
    { id: 'hakkimizda', label: 'Hakkımızda', icon: <Building2 className="w-4 h-4" /> },
    { id: 'iletisim', label: 'İletişim Bölümü', icon: <Mail className="w-4 h-4" /> },
    { id: 'kvkk', label: 'KVKK Aydınlatma Metni', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'gizlilik', label: 'Gizlilik Sözleşmesi', icon: <Lock className="w-4 h-4" /> },
    { id: 'sozlesme', label: 'Mesafeli Satış Sözleşmesi', icon: <FileText className="w-4 h-4" /> },
    { id: 'iade', label: 'Teslimat ve İade Şartları', icon: <RefreshCw className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FCFCFD]">
      <Header />

      <main className="flex-grow w-full py-12 px-4 md:px-16 font-sans">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SOL KÖŞE: Sabitlenebilir Premium Menü Layout */}
          <div className="lg:col-span-3 bg-white border border-zinc-100 rounded-2xl p-4 shadow-sm lg:sticky lg:top-24 space-y-1.5">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-3 mb-3 font-mono">
              KURUMSAL REHBER
            </p>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all text-left ${
                  activeTab === item.id
                    ? 'bg-[#ffe119] text-[#1A2238] shadow-sm transform translate-x-1'
                    : 'text-zinc-600 hover:bg-gray-50 hover:text-[#1A2238]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={activeTab === item.id ? 'text-[#1A2238]' : 'text-zinc-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {activeTab === item.id && <ChevronRight className="w-4 h-4 shrink-0" />}
              </button>
            ))}
          </div>

          {/* SAĞ TARAF: Dinamik İçerik Alanı */}
          <div className="lg:col-span-9 bg-white border border-zinc-100 rounded-[28px] p-8 md:p-12 shadow-sm min-h-[600px]">
            
            {/* SEKMELER: 1. HAKKIMIZDA */}
            {activeTab === 'hakkimizda' && (
              <div className="space-y-8 animate-fadeIn">
                <div>
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono">BİZ KİMİZ?</span>
                  <h1 className="text-3xl font-black text-[#1A2238] uppercase tracking-tight mt-1">
                    İkinci Elde <span className="bg-[#ffe119] px-1 rounded-sm">Yeni Nesil</span> Dönem
                  </h1>
                </div>
                <div className="border-l-4 border-[#ffe119] pl-6 italic text-base text-[#1A2238] font-semibold leading-relaxed">
                  "Otobakar, şehir dışındaki araçlara körü körüne gitme riskini ortadan kaldıran, alıcı ile Türkiye'nin 81 ilindeki bağımsız ustaları buluşturan adil bir teknoloji platformudur."
                </div>
                <div className="space-y-4 text-zinc-600 text-sm md:text-base leading-relaxed">
                  <p>
                    Geleneksel araç alım süreçlerinde, farklı bir şehirde beğenilen bir aracı kontrol etmek her zaman büyük bir bütçe ve zaman kumarı olmuştur. Uçak veya otobüs biletleri, yol masrafları ve en nihayetinde ekspertiz noktasında yaşanan hüsranlar... Otobakar, tam olarak bu hantal ve fahiş maliyetli yapıyı yıkmak amacıyla kuruldu.
                  </p>
                  <p>
                    Biz, büyük zincir ekspertiz firmalarının yüksek ücretlerinden önce, sanayinin kalbinde yetişmiş yerel ustaların tecrübesine güveniyoruz. Geliştirdiğimiz mobil ağ sayesinde, siz yerinizden bile kalkmadan, aracın en yakınındaki bağımsız ustayı dakikalar içinde arabanın başına yönlendiriyoruz.
                  </p>
                </div>
              </div>
            )}

            {/* SEKMELER: 2. İLETİŞİM */}
            {activeTab === 'iletisim' && (
              <div className="space-y-8 animate-fadeIn">
                <div>
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono">BİZE ULAŞIN</span>
                  <h1 className="text-3xl font-black text-[#1A2238] uppercase tracking-tight mt-1">Bizimle İletişime Geçin</h1>
                  <p className="text-zinc-500 text-sm mt-2 leading-relaxed">
                    Sistem işleyişi, usta ortaklığı veya destek talepleriniz için aşağıdaki resmi kanallarımız üzerinden bizimle doğrudan irtibat kurabilirsiniz.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="bg-gray-50/50 p-6 rounded-2xl border border-zinc-100 flex items-start space-x-4 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-[#ffe119] flex items-center justify-center text-[#1A2238] shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-[#1A2238] text-base">Merkez Ofis Adresi</p>
                      <p className="text-zinc-500 text-sm mt-1 leading-relaxed">Fatih / İstanbul</p>
                    </div>
                  </div>

                  <div className="bg-gray-50/50 p-6 rounded-2xl border border-zinc-100 flex items-start space-x-4 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-[#ffe119] flex items-center justify-center text-[#1A2238] shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-[#1A2238] text-base">E-Posta İletişim</p>
                      <p className="text-zinc-500 text-sm mt-1 leading-relaxed">destek@otobakar.com</p>
                    </div>
                  </div>

                  <div className="bg-gray-50/50 p-6 rounded-2xl border border-zinc-100 flex items-start space-x-4 shadow-sm md:col-span-2">
                    <div className="w-10 h-10 rounded-xl bg-[#ffe119] flex items-center justify-center text-[#1A2238] shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-[#1A2238] text-base">Çalışma ve Operasyon Saatleri</p>
                      <p className="text-zinc-500 text-sm mt-1 leading-relaxed">
                        Pazartesi - Pazar / 09:00 - 19:00 <br />
                        <span className="text-xs text-zinc-400 mt-1 block">*(Saha ekiplerimiz ve bağımsız ustalarımız, araç sahiplerinin müsaitliğine göre hafta sonları da aktif inceleme yapmaktadır.)</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SEKMELER: 3. KVKK AYDINLATMA METNİ */}
            {activeTab === 'kvkk' && (
              <div className="space-y-6 text-zinc-600 text-xs md:text-sm leading-relaxed max-h-[650px] overflow-y-auto pr-2 animate-fadeIn">
                <div className="border-b border-zinc-100 pb-4">
                  <h1 className="text-2xl font-black text-[#1A2238] uppercase tracking-tight flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-[#ffe119]" /> KVKK Aydınlatma Metni
                  </h1>
                  <p className="text-xs text-zinc-400 font-medium mt-1">6698 Sayılı Kanun Uyarınca Bilgilendirme — Son Güncelleme: Haziran 2026</p>
                </div>

                <p>
                  <strong>Otobakar Teknoloji Anonim Şirketi</strong> (“Şirket” veya “Otobakar”) olarak; 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) ve ilgili ikincil mevzuat uyarınca, veri sorumlusu sıfatıyla, platformumuz, mobil uygulamalarımız ve web sitemiz üzerinden elde ettiğimiz kişisel verilerinizin işlenmesinde, korunmasında ve veri güvenliğinin uluslararası standartlarda sağlanmasında azami hassasiyeti göstereceğimizi beyan ederiz.
                </p>

                <div className="space-y-3">
                  <h3 className="font-black text-[#1A2238] uppercase flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ffe119] shrink-0" /> <span>1. Veri Sorumlusunun Kimliği</span>
                  </h3>
                  <p className="pl-6 text-zinc-500">
                    Veri Sorumlusu: Otobakar Teknoloji A.Ş.<br />
                    Adres: Fatih / İstanbul<br />
                    E-posta: destek@otobakar.com
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-black text-[#1A2238] uppercase flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ffe119] shrink-0" /> <span>2. İşlenen Kişisel Veri Kategorileri</span>
                  </h3>
                  <p className="pl-6">Platformumuzun sunduğu dijital aracılık ve ön operasyon hizmetleri kapsamında aşağıdaki veri kategorileri tamamen veya kısmen otomatik yollarla işlenmektedir:</p>
                  <ul className="list-disc pl-10 space-y-1 text-zinc-500">
                    <li><strong>Kimlik Bilgileri:</strong> Ad, soyad.</li>
                    <li><strong>İletişim Bilgileri:</strong> Cep telefonu numarası, e-posta adresi.</li>
                    <li><strong>Lokasyon Bilgileri:</strong> Hizmet alınacak veya atanacak il, ilçe ve koordinat verileri.</li>
                    <li><strong>Mesleki Deneyim (Yalnızca Ustalar İçin):</strong> Sanayi geçmişi, uzmanlık alanları, referanslar ve usta başvuru formunda beyan edilen belgeler.</li>
                    <li><strong>İşlem Güvenliği Verileri:</strong> IP adresi, log kayıtları, cihaz ID verileri ve doğrulama kodları (SMS logları).</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-black text-[#1A2238] uppercase flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ffe119] shrink-0" /> <span>3. Kişisel Verilerin İşlenme Amaçları ve Hukuki Sebepleri</span>
                  </h3>
                  <p className="pl-6">Toplanan kişisel verileriniz, Kanun'un 5. ve 6. maddelerinde belirtilen yasal gerekçeler doğrultusunda şu amaçlarla işlenir:</p>
                  <div className="pl-6 space-y-2 text-zinc-500">
                    <p><strong>a) Sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması sebebiyle:</strong> Kullanıcı kaydının açılması, talep edilen ön kontrol siparişinin oluşturulması ve sahada incelemeyi yapacak freelance usta ile eşleştirilme sürecinin yürütülmesi.</p>
                    <p><strong>b) Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi sebebiyle:</strong> Ödemelerin faturalandırılması, mali denetim süreçleri ve yetkili kamu kurumlarına yasal bildirimlerin gerçekleştirilmesi.</p>
                    <p><strong>c) Veri sorumlusunun meşru menfaatleri için veri işlenmesinin zorunlu olması sebebiyle:</strong> Platformun siber güvenliğinin korunması, dolandırıcılık faaliyetlerinin engellenmesi ve hizmet kalitesinin optimize edilmesi.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-black text-[#1A2238] uppercase flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ffe119] shrink-0" /> <span>4. İşlenen Verilerin Üçüncü Taraflara Aktarılması</span>
                  </h3>
                  <p className="pl-6">Kişisel verileriniz Otobakar tarafından ticari amaçlarla asla satılmaz, üçüncü taraf reklam ağlarına pazarlama amacıyla aktarılmaz. Verileriniz yalnızca;</p>
                  <ul className="list-disc pl-10 space-y-1 text-zinc-500">
                    <li>Müşterinin oluşturduğu "Araç Ön Kontrol" talebinin yerine getirilebilmesi amacıyla, o bölgede **görevlendirilen bağımsız freelance saha ustasına** (yalnızca iletişim ve lokasyon bazında),</li>
                    <li>Yasal zorunluluklar, yargı kararları veya adli soruşturmalar kapsamında **Emniyet Genel Müdürlüğü, Mahkemeler ve ilgili resmi kurumlara** aktarılır.</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-black text-[#1A2238] uppercase flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ffe119] shrink-0" /> <span>5. Veri Sahibinin Kanuni Hakları (Madde 11)</span>
                  </h3>
                  <p className="pl-6">KVKK’nın 11. maddesi kapsamında her an şirketimize başvurarak; verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, eksik/yanlış işlenmişse düzeltilmesini isteme ve verilerinizin tamamen silinmesini (anonim hale getirilmesini) talep etme haklarına sahipsiniz. Taleplerinizi sistemde kayıtlı e-posta adresiniz üzerinden <strong>destek@otobakar.com</strong> adresine yazılı olarak iletebilirsiniz.</p>
                </div>
              </div>
            )}

            {/* SEKMELER: 4. GİZLİLİK SÖZLEŞMESİ */}
            {activeTab === 'gizlilik' && (
              <div className="space-y-6 text-zinc-600 text-xs md:text-sm leading-relaxed max-h-[650px] overflow-y-auto pr-2 animate-fadeIn">
                <div className="border-b border-zinc-100 pb-4">
                  <h1 className="text-2xl font-black text-[#1A2238] uppercase tracking-tight flex items-center gap-2">
                    <Lock className="w-6 h-6 text-[#ffe119]" /> Gizlilik Sözleşmesi
                  </h1>
                  <p className="text-xs text-zinc-400 font-medium mt-1">Platform Güvenliği ve Gizlilik Politikası Standartları — Son Güncelleme: Haziran 2026</p>
                </div>

                <p>
                  İşbu Gizlilik Sözleşmesi ve Politika, <strong>Otobakar Teknoloji A.Ş.</strong> bünyesinde işletilen dijital pazaryeri platformu üzerinden hizmet alan "Müşteriler" ile platforma kayıtlı bağımsız "Freelance Ustalar" ve ziyaretçilerin gizlilik haklarını tam koruma altına almak amacıyla akdedilmiştir.
                </p>

                <div className="space-y-3">
                  <h3 className="font-black text-[#1A2238] uppercase flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ffe119] shrink-0" /> <span>1. Veri Güvenliği ve Kriptolama</span>
                  </h3>
                  <p className="pl-6 text-zinc-500">
                    Otobakar, platform üzerinden gerçekleştirilen tüm veri transferlerinde SSL (Secure Sockets Layer) 256-bit şifreleme protokollerini kullanır. Kredi kartı ve ödeme bilgileriniz yasal regülasyonlar (PCI-DSS) gereği kesinlikle altyapımızda veya sunucularımızda saklanmaz. Tüm finansal işlemler BDDK lisanslı aracı ödeme kuruluşu (İyzico) üzerinden doğrudan bankacılık kanallarına kriptolu olarak iletilir.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-black text-[#1A2238] uppercase flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ffe119] shrink-0" /> <span>2. Saha Verilerinin ve Usta Raporlarının Mahremiyeti</span>
                  </h3>
                  <p className="pl-6 text-zinc-500">
                    Bağımsız usta tarafından araca ait yapılan tüm fiziki, mekanik, ses kayıtlı ve görsel incelemeler sonucunda oluşturulan "Ön Kontrol Raporu", yalnızca **hizmet bedelini ödeyen Müşterinin şahsına özeldir.** Otobakar, bu raporun gizliliğini taahhüt eder. Söz konusu veriler, araç sahibi de dahil olmak üzere üçüncü şahıslarla paylaşılmaz ve ticari pazarlamaya konu edilemez. Raporların sistemde saklanma süresi, olası yasal uyuşmazlıklarda delil niteliği taşıması amacıyla 2 (iki) yıldır.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-black text-[#1A2238] uppercase flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ffe119] shrink-0" /> <span>3. Tarafların Karşılıklı Sır Saklama Yükümlülüğü</span>
                  </h3>
                  <p className="pl-6 text-zinc-500">
                    Platformu kullanan Müşteriler ve sisteme atanan bağımsız saha ustaları, operasyon sırasında birbirlerine ait öğrendikleri tüm kişisel, ticari ve operasyonel bilgileri (telefon numarası, adres, araç sahibinin kimlik bilgileri, fiyatlandırma politikaları vb.) süresiz olarak saklamakla yükümlüdür. Bilgilerin taraflardan biri tarafından ifşa edilmesi durumunda doğacak tüm doğrudan veya dolaylı maddi-manevi zararlardan ifşayı gerçekleştiren taraf hukuken sorumludur.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-black text-[#1A2238] uppercase flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ffe119] shrink-0" /> <span>4. Çerez (Cookie) Kullanımı ve Analiz</span>
                  </h3>
                  <p className="pl-6 text-zinc-500">
                    Web sitemiz ve mobil uygulamalarımız, kullanıcı deneyimini iyileştirmek, sistemsel hataları tespit etmek ve platform performansını optimize etmek amacıyla teknik çerezler kullanmaktadır. Çerez ayarlarınızı tarayıcınız üzerinden dilediğiniz an değiştirebilirsiniz; ancak bu durum platformun bazı fonksiyonlarının eksik çalışmasına sebebiyet verebilir.
                  </p>
                </div>
              </div>
            )}

            {/* SEKMELER: 5. MESAFELİ SATIŞ SÖZLEŞMESİ */}
            {activeTab === 'sozlesme' && (
              <div className="space-y-6 text-zinc-600 text-xs md:text-sm leading-relaxed max-h-[650px] overflow-y-auto pr-2 animate-fadeIn">
                <div className="border-b border-zinc-100 pb-4">
                  <h1 className="text-2xl font-black text-[#1A2238] uppercase tracking-tight flex items-center gap-2">
                    <Scale className="w-6 h-6 text-[#ffe119]" /> Mesafeli Satış Sözleşmesi
                  </h1>
                  <p className="text-xs text-zinc-400 font-medium mt-1">6502 Sayılı TKHK ve Mesafeli Sözleşmeler Yönetmeliği Standartları — Son Güncelleme: Haziran 2026</p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-black text-[#1A2238] uppercase flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ffe119] shrink-0" /> <span>Madde 1 - Taraflar</span>
                  </h3>
                  <p className="pl-6 text-zinc-500">
                    <strong>1.1. SATICI / HİZMET SAĞLAYICI:</strong><br />
                    Ünvan: Otobakar Teknoloji A.Ş.<br />
                    Adres: Fatih / İstanbul<br />
                    E-posta: destek@otobakar.com<br />
                    <br />
                    <strong>1.2. ALICI / MÜŞTERİ:</strong><br />
                    Otobakar platformu (Web/Mobil) üzerinden üyelik işlemlerini tamamlayıp, dijital onay vererek araç ön inceleme/rehberlik hizmeti sipariş eden nihai kullanıcıdır. Müşterinin kayıt esnasında beyan ettiği kimlik ve iletişim bilgileri esas alınır.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-black text-[#1A2238] uppercase flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ffe119] shrink-0" /> <span>Madde 2 - Sözleşmenin Konusu ve Kapsamı</span>
                  </h3>
                  <p className="pl-6">İşbu sözleşmenin konusu; Müşteri'nin, Satıcı'ya ait Otobakar teknoloji platformu üzerinden elektronik ortamda siparişini verdiği, nitelikleri ve fiyatı sipariş formunda/ödeme ekranında açıkça belirtilen "Mobil Usta Ön İnceleme Rehberlik Hizmeti"nin satışı, ifası ve teslimi ile ilgili olarak Tüketicinin Korunması Hakkında Kanun uyarınca tarafların karşılıklı hak ve yükümlülüklerinin saptanmasıdır.</p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-black text-[#1A2238] uppercase flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ffe119] shrink-0" /> <span>Madde 3 - Hizmetin İfası ve Sorumluluk Sınırları (Hayati Şerh)</span>
                  </h3>
                  <p className="pl-6">
                    Otobakar, ikinci el araç satın almayı düşünen Müşteri ile aracın satıldığı il/ilçedeki bağımsız (freelance) sanayi ustalarını bir araya getiren bir teknoloji pazaryeridir. Atanan usta tarafından gerçekleştirilen motor dinleme, kaporta göz kontrolü ve test sürüşü gibi işlemler, ustanın kişisel mesleki tecrübesine dayalı şeffaf bir ön değerlendirmedir.
                  </p>
                  <div className="mx-6 p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start space-x-3 text-zinc-700">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="font-medium text-xs">
                      <strong>HUKUKİ YASAL UYARI:</strong> Otobakar platformu üzerinden satın alınan bu hizmet, TSE belgeli kurumsal ekspertiz merkezlerinde ağır diagnostik test cihazları (Dyno testi, lift alt taban incelemesi, elektronik beyin taraması vb.) ile yapılan yasal ekspertiz raporu niteliğinde <u>asla değildir</u>. Sunulan veriler bir "ön süzgeç, usta görüşü ve tavsiye" niteliğindedir. Alıcı'nın bu rapora dayanarak araç hakkında verdiği satın alma kararlarından, araçta sonradan çıkabilecek gizli ayıplardan, mekanik arızalardan veya hukuki pürüzlerden Otobakar Teknoloji A.Ş. veya operasyonu yürüten bağımsız freelance usta hukuki ve mali olarak sorumlu tutulamaz.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-black text-[#1A2238] uppercase flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ffe119] shrink-0" /> <span>Madde 4 - Ücretlendirme ve Ödeme Şartları</span>
                  </h3>
                  <p className="pl-6">Hizmet bedeli, Müşteri'nin sipariş esnasında seçtiği araç konumu ve paket detaylarına göre belirlenir ve KDV dahil olarak tahsil edilir. Hizmet bedeli tahsil edilmeden, saha operasyonları ve usta görevlendirme süreçleri başlatılmaz.</p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-black text-[#1A2238] uppercase flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ffe119] shrink-0" /> <span>Madde 5 - Cayma Hakkı, İptal ve İade Koşulları</span>
                  </h3>
                  <p className="pl-6">Mesafeli Sözleşmeler Yönetmeliği’nin 15/g maddesi uyarınca, "tüketicinin onayı ile elektronik ortamda anında ifa edilen hizmetlere" ilişkin olarak normal şartlarda cayma hakkı kullanılamaz. Ancak Müşteri lehine esnetilen iptal şartları şu şekildedir:</p>
                  <ul className="list-disc pl-10 space-y-1 text-zinc-500">
                    <li>Sipariş oluşturulduktan sonra, <strong>sistem tarafından atanan freelance usta henüz yerinden yola çıkmamış veya araç sahibinin yanına varmamış ise</strong> Müşteri talebini koşulsuz iptal edebilir. Bu durumda tahsil edilen ücret kartına aynen iade edilir.</li>
                    <li>Atanan usta, aracın bulunduğu konuma ulaştıktan, araç sahibiyle veya araçla fiziksel temas sağladıktan sonra hizmetin ifası fiilen başlamış sayılacağından dolayı siparişin iptali veya ücret iadesi hiçbir koşulda talep edilemez.</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-black text-[#1A2238] uppercase flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ffe119] shrink-0" /> <span>Madde 6 - Yürürlük ve Elektronik Onay</span>
                  </h3>
                  <p className="pl-6">Müşteri, Otobakar platformu üzerinden siparişini onayladığı an işbu sözleşmenin tüm maddelerini ayrı ayrı okuduğunu ve onayladığını beyan etmiş sayılır. Sözleşme elektronik onay anında karşılıklı olarak yürürlüğe girer.</p>
                </div>
              </div>
            )}

            {/* SEKMELER: 6. TESLİMAT VE İADE ŞARTLARI */}
            {activeTab === 'iade' && (
              <div className="space-y-6 text-zinc-600 text-xs md:text-sm leading-relaxed max-h-[650px] overflow-y-auto pr-2 animate-fadeIn">
                <div className="border-b border-zinc-100 pb-4">
                  <h1 className="text-2xl font-black text-[#1A2238] uppercase tracking-tight flex items-center gap-2">
                    <RefreshCw className="w-6 h-6 text-[#ffe119]" /> Teslimat ve İade Şartları
                  </h1>
                  <p className="text-xs text-zinc-400 font-medium mt-1">Hizmet İfa Standartları ve İptal Prosedürleri — Son Güncelleme: Haziran 2026</p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-black text-[#1A2238] uppercase flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ffe119] shrink-0" /> <span>1. Dijital Teslimat ve İfa Süreçleri</span>
                  </h3>
                  <p className="pl-6 text-zinc-500">
                    Otobakar platformu fiziksel bir mal satışı yapmamaktadır; sunulan ürün tamamen dijital ortamda ifa edilen bir <strong>"Saha Bilgilendirme ve Mobil Usta Ön İnceleme"</strong> hizmetidir. Sipariş ödemesi başarıyla tamamlandıktan sonra, sistem ilgili lokasyondaki en uygun bağımsız ustayı görevlendirir. Usta, araç sahibiyle iletişime geçerek randevulaşır. İnceleme tamamlandığında hazırlanan dijital rapor, Müşterinin paneline yüklenir ve SMS/E-posta yoluyla anlık olarak teslim edilir. Dijital teslimat gerçekleştikten sonra hizmet tamamen sonlanmış kabul edilir.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-black text-[#1A2238] uppercase flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ffe119] shrink-0" /> <span>2. Haklı İptal ve Tam İade Koşulları</span>
                  </h3>
                  <p className="pl-6 text-zinc-500">
                    Müşteri, aşağıdaki mücbir ve haklı sebepler doğrultusunda siparişinin tamamen iptal edilmesini ve ödediği ücretin kesintisiz olarak kartına iade edilmesini talep edebilir:
                  </p>
                  <ul className="list-disc pl-10 space-y-1 text-zinc-500">
                    <li>Sipariş ataması yapılmış olmasına rağmen, görevlendirilen bağımsız ustanın **henüz yola çıkmamış veya araca ulaşmamış olması** durumunda Müşteri paneli üzerinden yapılan anlık iptaller.</li>
                    <li>Araç sahibine ulaşılamaması, araç sahibinin aracı göstermekten son anda vazgeçmesi veya aracın belirtilen adreste bulunamaması gibi Otobakar dışındaki harici engellerde (Usta henüz yola çıkmadıysa).</li>
                    <li>Sipariş saatinden itibaren mücbir sebepler veya operasyonel yoğunluklar nedeniyle 48 saat içerisinde bölgeye usta ataması gerçekleştirilememiş olması durumunda.</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-black text-[#1A2238] uppercase flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ffe119] shrink-0" /> <span>3. İade Edilemez Durumlar ve Kısmi Kesinti (Yol ve Zaman Şerhi)</span>
                  </h3>
                  <div className="mx-6 p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start space-x-3 text-zinc-700">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="font-medium text-xs">
                      <strong>ÖNEMLİ HUKUKİ KESİNTİ ŞARTI:</strong> Sistem tarafından atanan bağımsız usta, Müşterinin beyan ettiği lokasyona gitmek üzere **yola çıktıktan veya araç konumuna ulaştıktan sonra** iptal hakkı kullanılamaz. Eğer usta olay yerine varmış ancak araç sahibi aracı getirmemişse, araç satılmışsa veya usta araca ulaştıktan sonra müşteri caydığını bildirirse, bağımsız ustanın harcadığı zaman, emek ve yol/yakıt masraflarının karşılanması amacıyla **hizmet bedelinin %40'ı oranında operasyonel kesinti (yol/hizmet bedeli tazminatı) yapılır.** Kalan tutar müşteriye iade edilir. Usta aracı incelemeye başladıktan sonra ise hiçbir şekilde iade talep edilemez.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-black text-[#1A2238] uppercase flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ffe119] shrink-0" /> <span>4. İade Süreci ve Yansıma Süresi</span>
                  </h3>
                  <p className="pl-6 text-zinc-500">
                    Onaylanan iade talepleri, Otobakar finans ekibi tarafından aracı ödeme kuruluşuna (İyzico) anında bildirilir. Ücretin banka hesabınıza veya kredi kartı ekstrenize yansıma süresi, bankaların iç prosedürlerine bağlı olarak **1 ila 7 iş günü** arasında değişiklik gösterebilir. Blokeli veya taksitli ödemelerin iade kırılımları tamamen kartı veren bankanın sorumluluğundadır.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}