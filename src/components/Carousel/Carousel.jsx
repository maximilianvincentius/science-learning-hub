import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Card from '../Card/Card';

import './Carousel.css';

// Import Ant Design icons
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

// import required modules
import { Autoplay, EffectCoverflow, Pagination, Navigation } from 'swiper/modules';

const _renderItems = (items, isFromSimulation) => {
  if (isFromSimulation) {
    return items.map((item, index) => (
      <SwiperSlide key={index} className="items-center flex justify-center">
        <Link className="" to={`/simulation/${item.simulationId}`}>
          <Card title={item.title} image={item.image} isCarousel={true} />
        </Link>
      </SwiperSlide>
    ));
  }

  return items.map((item, index) => (
    <SwiperSlide key={index} className="items-center flex justify-center">
      <Link className="" to={`/article/${item._id}`}>
        <Card
          containImage={false}
          itemId={item._id}
          title={item.title}
          description={item.content}
          topic={item.topic}
          author={item.author}
          image={item.image}
          isCarousel={true}
          updatedAt={item.updatedAt}
        />
      </Link>
    </SwiperSlide>
  ));
};

const _handlePrev = (swiperRef) => () => {
  const swiper = swiperRef.current;

  if (!swiper) {
    return;
  }

  if (swiper.isBeginning) {
    swiper.slideTo(swiper.slides.length - 1);
    return;
  }

  swiper.slidePrev();
};

const _handleNext = (swiperRef) => () => {
  const swiper = swiperRef.current;

  if (!swiper) {
    return;
  }

  if (swiper.isEnd) {
    swiper.slideTo(0);
    return;
  }

  swiper.slideNext();
};

const Carousel = ({ items, isFromSimulation = false }) => {
  const swiperRef = useRef(null);

  return (
    <>
      <div className="relative w-full my-10 cursor-pointer">
        <Swiper
          effect={'coverflow'}
          centeredSlides={true}
          slidesPerView={1.15}
          breakpoints={{
            640: {
              slidesPerView: 1.5
            },
            1024: {
              slidesPerView: 2.6
            },
            1280: {
              slidesPerView: 3
            }
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          coverflowEffect={{
            rotate: 28,
            stretch: 0,
            depth: 140,
            modifier: 1.1,
            slideShadows: false
          }}
          pagination={{ clickable: true }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Autoplay, EffectCoverflow, Pagination]}
          className="py-8 sm:py-10"
        >
          {_renderItems(items, isFromSimulation)}
        </Swiper>

        {/* Custom Navigation with Ant Design Icons */}
        <button type="button" className="swiper-button-prev" onClick={_handlePrev(swiperRef)}>
          <LeftOutlined />
        </button>
        <button type="button" className="swiper-button-next" onClick={_handleNext(swiperRef)}>
          <RightOutlined />
        </button>
      </div>
    </>
  );
};

export default Carousel;
