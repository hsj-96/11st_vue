<template>
  <header>
    <div class="inner">
      <div
        class="open-nav-drawer"
        @click="onNav">
      </div>
      <a
        href="/"
        class="logo"></a>
      <div class="search">
        <input
          v-model="searchText"
          placeholder="찾고 싶은 상품을 검색해 보세요!" 
          @keypress.enter="search" />
        <div
          class="search__icon"
          @click="search"></div>
      </div>
      <div class="ranking">
        <div
          ref="swiper"
          class="swiper">
          <div class="swiper-wrapper">
            <div
              v-for="(rank, index) in rankings.rankings"
              :key="rank.name"
              class="swiper-slide">
              <a :href="rank.href">
                <span class="index">{{ index + 1 }}</span>
                <span class="name">{{ rank.name }}</span>
              </a>
            </div>
          </div>
        </div>
        <div
          class="open-more"
          @click="toggleRankingWrap"></div>
        <div
          v-if="isShowRankingWrap"
          class="ranking-wrap">
          <div class="title">
            <h4>실시간 쇼핑 검색어</h4>
            <div class="time">
              {{ rankings.referenceDate ? timeString : '' }}
            </div>
            <div
              class="close-wrap"
              @click="toggleRankingWrap"></div>
          </div>
          <div class="tabs">
            <div
              class="tab"
              :class="{ active: tabIdx === 0 ? true : false }"
              @click="tabIdx = 0">
              1~10위
            </div>
            <div
              class="tab"
              :class="{ active: tabIdx === 1 ? true : false }"
              @click="tabIdx = 1">
              11~20위
            </div>
          </div>
          <div
            v-if="rankings.rankings"
            class="list">
            <li
              v-for="(rank, idx) in tabRankings"
              :key="rank.name">
              <a :href="rank.href">
                <span class="index">{{ 10 * tabIdx + idx + 1 }}</span>
                <span class="name">{{ rank.name }}</span>
                <span class="relative-name">{{ rank.relativeName }}</span>
                <span
                  :class="rank.status"
                  class="icon"></span>
              </a>
            </li>
          </div>
        </div>
      </div>
      <div class="user-menu">
        <li class="my">
          <a href="javascript:void(0)"></a>
          <ul class="my__menu">
            <li
              v-for="(name, idx) in myMenu"
              :key="name+idx">
              <a href="javascript:void(0)">
                {{ name }}
              </a>
            </li>
          </ul>
        </li>
        <li>
          <a href="javascript:void(0)"></a>
        </li>
        <li>
          <a href="javascript:void(0)"></a>
        </li>
        <li>
          <a
            href="javascript:void(0)"
            @click="onNavRNB"></a>
        </li>
      </div>
    </div>
  </header>
</template>

<script>
import Swiper from 'swiper/bundle'
import 'swiper/css/bundle'

export default {
  data() {
    return {
      searchText: '',
      rankings: {},
      isShowRankingWrap: false,
      tabIdx: 0,
      myMenu: [ '나의 쿠폰', '주문/배송조회','취소/반품/교환', '고객센터', '회원정보' ]
    }
  },
  computed: {
    timeString() {
      function isZeroNeed(num) {
        return num < 10 ? '0'+num : num
      }

      const date = new Date(this.rankings.referenceDate)
      const year = '20' + date.getYear().toString().slice(1,3)
      const month = isZeroNeed(date.getMonth() + 1)
      const day = isZeroNeed(date.getDate())
      const hour = isZeroNeed(date.getHours())
      const min = isZeroNeed(date.getMinutes())
      
      //2021.01.01 20:00 기준
      return `${year}.${month}.${day} ${hour}:${min} 기준`
    },
    tabRankings() {
      return this.rankings.rankings.filter((rank, idx) => {
        // tabIdx = 0, 1 
        const start = this.tabIdx * 10
        const end = start + 9
        return idx >= start && idx <= end
      })
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.rankings = await this.$fetch({
        requestName: 'rankings'
      })
      console.log(this.rankings)

      await this.$nextTick()
      new Swiper(this.$refs.swiper, {
        direction: 'vertical',
        speed: 1000,
        autoplay: {
          delay: 3000
        },
        loop: true
      })
    },
    onNav() {
      this.$store.dispatch('navigation/onNav')
    },
    onNavRNB() {
      this.$store.dispatch('navigation/onNavRNB')
    },
    async search() {
      if (!this.searchText.trim()) return

      const res = await this.$search({
        searchText: this.searchText
      })
      console.log('검색 : ', res)
    },
    toggleRankingWrap() {
      this.isShowRankingWrap = !this.isShowRankingWrap
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  background-color: #fff;
  &.fixed {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 97;
    box-shadow: 0 2px 8px rgba(#000, .07);
    .inner {
      height: 80px;
    }
  }
  .inner {
    height: 120px;
    display: flex;
    align-items: center;
  }
  .open-nav-drawer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    cursor: pointer;
    box-shadow:
      0 2px 6px rgba(#000,.06),
      0 0 1px rgba(#000,.4);
    &::after {
      content: "";
      display: block;
      width: 36px;
      height: 36px;
      background-image: url("https://trusting-williams-8cacfb.netlify.app/images/globals_2x.png");
      background-position: -302px -203px;
      background-size: 363px;
    }
  }
  .logo {
    width: 94px;
    height: 40px;
    margin: 0 24px;
    background-image: url("https://trusting-williams-8cacfb.netlify.app/images/globals_2x.png");
    background-position: -162px 0;
    background-size: 363px;
    cursor: pointer;
  }
  .search {
    position: relative;
    input {
      width: 500px;
      height: 50px;
      padding: 0 27px;
      border: 1px solid #ddd;
      border-radius: 25px;
      box-sizing: border-box;
      background-color: #fafafa;
      outline: none;
      font-size: 18px;
      font-family: 'Noto Sans KR', sans-serif;
      &::placeholder {
        color: #bbb;
      }
    }
    &__icon {
      width: 50px;
      height: 50px;
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
      background-image: url("https://trusting-williams-8cacfb.netlify.app/images/globals_2x.png");
      background-position: -162px -45px;
      background-size: 363px;
    }
  }
  .ranking {
    width: 210px;
    position: relative;
    margin: 0 30px;
    .swiper {
      width: 182px;
      height: 28px;
      margin: 0;
      .swiper-slide {
        transition: .4s;
        opacity: 0;
        a {
          display: block;
          height: 28px;
          line-height: 28px;
          text-decoration: none;
          font-size: 15px;
          color: #333;
          font-weight: 700;
          .index {
            margin-right: 10px;
            color: #f43142;
            font-style: italic;
          }
          &:hover .name {
            color: #f43142;
          }
        }
        &.swiper-slide-active {
          opacity: 1;
        }
      }
    }
    .open-more {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      position: absolute;
      top: 0;
      right: 0;
      z-index: 1; // Required! Cause Swiper.
      cursor: pointer;
      user-select: none; // 실시간 쇼핑 검색어가 자동으로 선택(Selection)되는 것을 방지.
      &:hover {
        background-color: #ececec;
      }
      &::after {
        content: "";
        display: block;
        width: 7px;
        height: 7px;
        margin-top: -3px;
        border: solid #999;
        border-width: 0 1px 1px 0;
        box-sizing: border-box;
        transform: rotate(45deg);
      }
    }
    .ranking-wrap {
      position: absolute;
      top: 44px;
      z-index: 2;
      width: 410px;
      padding: 18px 25px 25px;
      border: 1px solid #eee;
      border-radius: 4px;
      box-sizing: border-box;
      box-shadow: 0 6px 24px rgb(0 0 0 / 10%);
      background-color: #fff;
      .title {
        display: flex;
        align-items: flex-end;
        h4 {
          font-size: 17px;
          font-weight: 700;
        }
        .time {
          margin-left: 10px;
          font-size: 13px;
          color: #999;
          flex: 1;
        }
        .close-wrap {
          width: 36px;
          height: 36px;
          background-image: url(https://trusting-williams-8cacfb.netlify.app/images/globals_2x.png);
          background-position: -261px -203px;
          background-size: 363px;
          cursor: pointer;
          margin: -6px -10px;
          transform: scale(0.6666);
        }
      }
      .tabs {
        height: 40px;
        margin: 18px 0;
        border: 1px solid #eee;
        box-sizing: border-box;
        background-color: #fafafa;
        display: flex;
        .tab {
          flex: 1;
          color: #7d7d7d;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          &.active {
            background-color: #fff;
            font-weight: 700;
            color: #333;
          }
        }
      }
      .list {
        list-style: none;
        li {
          position: relative;
          margin-top: 14px;
          &:first-child {
            margin-top: 0;
          }
          a {
            display: block;
            height: 22px;
            line-height: 22px;
            text-decoration: none;
            font-size: 15px;
            color: #000;
            .index {
              font-weight: 700;
              margin-right: 10px;
              color: #f43142;
              font-style: italic;
            }
            .relative-name {
              margin-left: 4px;
              font-size: 13px;
              color: #999;
            }
          }
          .icon {
            position: absolute;
            top: 0;
            right: 0;
            width: 22px;
            height: 22px;
            background-image: url("https://trusting-williams-8cacfb.netlify.app/images/globals_2x.png");
            background-size: 363px;
            &.stay {
              background-image: none;
              &::after {
                content: "";
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;
                width: 6px;
                height: 2px;
                background: #999;
              }
            }
            &.up {
              background-position: -110px -251px;
            }
            &.down {
              background-position: -58px -251px;
            }
          }
        }
      }
    }
  }
  .user-menu {
    display: flex;
    list-style: none;
    > li {
      margin-right: 25px;
      padding: 7px 0;
      position: relative;
      &:last-child {
        margin-right: 0;
      }
      > a {
        display: block;
        width: 48px;
        height: 48px;
        background-image: url("https://trusting-williams-8cacfb.netlify.app/images/globals_2x.png");
        background-size: 363px;
      }
      &:nth-child(1) > a { background-position: -106px -145px; }
      &:nth-child(2) > a { background-position: 0px -198px; }
      &:nth-child(3) > a { background-position: -53px -198px; }
      &:nth-child(4) > a { background-position: -94px -70px; }
      &:nth-child(1) > a:hover { background-position: -53px -145px; }
      &:nth-child(2) > a:hover { background-position: -159px -145px; }
      &:nth-child(3) > a:hover { background-position: 0px -145px; }
      &:nth-child(4) > a:hover { background-position: -106px -198px; }
      &.my {
        &:hover {
          .my__menu {
            display: block;
          }
        }
        .my__menu {
          display: none;
          width: 170px;
          padding: 15px 0;
          position: absolute;
          top: 60px;
          left: 0;
          z-index: 2;
          border: 1px solid #eee;
          border-radius: 6px;
          box-sizing: border-box;
          box-shadow: 0 6px 24px -8px rgba(#000,.12);
          background-color: #fff;
          li {
            a {
              display: block;
              padding: 7px 10px 7px 25px;
              font-size: 15px;
              &:hover {
                color: #f43142;
                background: #fafafa;
              }
            }
          }
        }
      }
    }
  }
}
</style>
