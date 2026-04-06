'use client';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#FFE6F7', padding: '40px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#141414', marginBottom: '20px' }}>
          CHPOK
        </h1>
        <p style={{ fontSize: '20px', color: '#5D5856', marginBottom: '30px' }}>
          Один чпок — нарушение замечено
        </p>
        
        <div style={{ 
          background: 'white', 
          padding: '30px', 
          border: '1px solid #585858',
          marginBottom: '40px'
        }}>
          <h2 style={{ color: '#141414', fontSize: '24px', marginBottom: '15px' }}>
            Статистика
          </h2>
          <p style={{ color: '#5D5856', fontSize: '18px' }}>
            Всего чпоков: <strong>14,253</strong>
          </p>
          <p style={{ color: '#5D5856', fontSize: '18px' }}>
            Обработано: <strong>9,841</strong>
          </p>
          <p style={{ color: '#5D5856', fontSize: '18px' }}>
            Городов: <strong>12</strong>
          </p>
        </div>

        <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#141414', marginBottom: '20px' }}>
          Как это работает
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '20px',
          marginBottom: '40px'
        }}>
          {[
            { num: '01', title: 'Сфотографируй', desc: 'Открой приложение и сними нарушение' },
            { num: '02', title: 'Укажи детали', desc: 'Выбери категорию и бренд' },
            { num: '03', title: 'Отправь чпок', desc: 'Мы передадим данные операторам' }
          ].map((step, i) => (
            <div 
              key={i}
              style={{
                background: '#141414',
                color: 'white',
                padding: '20px',
                borderTop: '2px solid #FEC733'
              }}
            >
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
                {step.num}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
                {step.title}
              </h3>
              <p style={{ fontSize: '14px', opacity: 0.7 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        <div style={{ 
          background: '#141414', 
          color: '#FEC733',
          padding: '40px',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '15px' }}>
            Готов чпокать?
          </h2>
          <button style={{
            background: '#FEC733',
            color: '#141414',
            padding: '15px 40px',
            fontSize: '16px',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer'
          }}>
            Скачать CHPOK
          </button>
        </div>
      </div>
    </div>
  );
}
