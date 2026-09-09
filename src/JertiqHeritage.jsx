import React from 'react';
import { Heart, Sparkles, Users } from 'lucide-react';

const items = [
  { no:'01', ar:'الجرتق السوداني', en:'Jertiq', icon:<Sparkles size={18}/>, text:'A cherished Sudanese tradition celebrating love, blessing, family and the beginning of a new life together.', textAr:'عادة سودانية عزيزة علينا، بنحتفل بيها بالحب والبركة والأهل وبداية حياة جديدة سوا.' },
  { no:'02', ar:'الحناء', en:'Henna', icon:<Heart size={18}/>, text:'An evening of warmth, beauty and togetherness, surrounded by family, friends and the joyful spirit of Sudan.', textAr:'ليلة دافية وجميلة بنجتمع فيها مع الأهل والأصحاب، وسط أجواء سودانية مليانة فرح ومحبة.' },
  { no:'03', ar:'الحلي والذهب', en:'Gold & Adornment', icon:<Sparkles size={18}/>, text:'Inspired by the elegance of Sudanese bridal adornment — refined, symbolic and presented with modern luxury.', textAr:'مستوحى من أناقة زينة العروس السودانية، بتفاصيل راقية ورمزية وبلمسة فخامة عصرية.' },
  { no:'04', ar:'الثوب والعمامة', en:'Sudanese Elegance', icon:<Users size={18}/>, text:'Traditional Sudanese clothing meets contemporary evening elegance in a celebration of heritage and style.', textAr:'اللبس السوداني التقليدي بيلتقي مع الأناقة العصرية في احتفال بالتراث والجمال والذوق.' }
];

export default function JertiqHeritage(){
  return <section className="jertiq-heritage" aria-label="Sudanese Jertiq heritage">
    <div className="jh-inner">
      <div className="jh-intro">
        <div className="eyebrow">THE BEAUTY OF OUR HERITAGE</div>
        <div className="jh-arabic">الجرتق السوداني</div>
        <h2>A tradition carried<br/><i>into forever.</i></h2>
        <p>A celebration that is more than a wedding — it is a meeting of hearts, families and generations, wrapped in the beauty of Sudanese tradition.</p>
        <span className="j-bilingual-ar" lang="ar">احتفال ما بس عرس؛ دي فرحة بتجمع القلوب والأهل والأجيال، في جمال وعراقة التقاليد السودانية.</span>
        <div className="jh-seal">✦ <span>Sudanese Heritage</span> ✦</div>
      </div>
      <div className="jh-grid">
        {items.map(item=><article className="jh-card" key={item.no}>
          <div className="jh-card-top"><span>{item.no}</span><span className="jh-icon">{item.icon}</span></div>
          <div className="jh-motif" aria-hidden="true">◇</div>
          <div className="jh-ar">{item.ar}</div>
          <h3>{item.en}</h3>
          <p>{item.text}</p>
          <span className="j-bilingual-ar" lang="ar">{item.textAr}</span>
        </article>)}
      </div>
    </div>
  </section>
}
