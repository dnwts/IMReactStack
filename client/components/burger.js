import React, { Component } from 'react';
import _ from 'lodash';
import { breakpoint } from '../config/constants';

let $ = window.$, $window = $(window), ScrollMagic = window.ScrollMagic, TweenMax = window.TweenMax, Power3 = window.Power3, TimelineLite = window.TimelineLite;

export default class Burger extends Component {
    constructor(props) {
        super(props);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    componentDidMount() {
        let refs = this.refs,
            scenes = this.scenes = {},
            controller = this.controller = new ScrollMagic.Controller(),
            hamburger = this.hamburger = $(refs.hamburger),
            trigger = this.article = hamburger.closest('article.page');

        this.timeLines = [];
        scenes[breakpoint.names.large] = [];
        scenes[breakpoint.names.medium] = [];
        scenes[breakpoint.names.small] = [];

        this.header = trigger.find('header.main');
        this.image = this.header.find('> .image .img');
        this.logoImage = this.header.find('> .logo .img');
        this.logoText = this.header.find('> .logo .text svg');
        this.links = this.header.find('nav ul li a');
        this.text = this.header.find('> .text h1');

        this.burger = $(refs.burger);
        this.close = $(refs.close);

        if (this.props.isHomepage) {
            this.homeLeft = [
                this.article.find('.slide-1.content .text-2 h2').toArray(),
                this.article.find('.slide-2.content .text-1 h1, .slide-2.content .text-3 .text-content').toArray(),
                this.article.find('.slide-3.content .text-2 h1').toArray(),
                this.article.find('.slide-4.content .text-1 h1').toArray(),
            ];
            this.homeRight = [
                this.article.find('.slide-1.content .text-1 h1').toArray(),
                this.article.find('.slide-2.content .text-2 .text-content').toArray(),
                this.article.find('.slide-3.content .text-1 h1').toArray(),
                {},
            ];
            this.smallHomeLeft = [
                this.article.find('.slide-1.content .text-1 h1, .slide-1.content .text-2 h2').toArray(),
                this.article.find('.slide-2.content .text-1 h1').toArray(),
                this.article.find('.slide-3.content .text-1 h1, .slide-3.content .text-2 h1').toArray(),
                this.article.find('.slide-4.content .text-1 h1').toArray(),
            ];
            this.homeBottom = [
                this.article.find('.slide-1.content .scroll-hint > *').toArray(),
                {}, {}, {},
            ];
            this.homeImage = [
                this.article.find('.slide-1.background .img').toArray(),
                this.article.find('.slide-2.background .img').toArray(),
                this.article.find('.slide-3.background .img').toArray(),
                this.article.find('.slide-4.background .img').toArray(),
            ];

            this.handleMediaChange(this.props.ui.media);
            return;
        }

        ////
        // LARGE SCREEN
        ///////////////////

        scenes[breakpoint.names.large].push(new ScrollMagic.Scene({ triggerElement: trigger, triggerHook: 'onLeave', offset: 1 }).addTo(controller)
            .on('start', (event => {

                if (event.scrollDirection == 'FORWARD') {
                    console.warn('BURGER SCENE SETTING ACTIVE');
                    hamburger.addClass('active');
                    this.showBurgerFromLeft();
                }
                if (event.scrollDirection == 'REVERSE') {
                    hamburger.removeClass('active');
                    this.hideBurgerToLeft();
                }
            }).bind(this))
        );

        scenes[breakpoint.names.large].push(new ScrollMagic.Scene({ triggerElement: trigger, triggerHook: 'onLeave', offset: 355 }).addTo(controller)
            .setTween(this.darken())
        );

        this.handleMediaChange(this.props.ui.media);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.transition.scrollScenesEnabled != nextProps.transition.scrollScenesEnabled) {
            this.setScenes(this.props.ui.media.current, nextProps.transition.scrollScenesEnabled);
        }
        if (this.props.ui.media.current != nextProps.ui.media.current) {
            this.handleMediaChange(nextProps.ui.media);
        }
        return false;
    }

    componentWillUnmount() {
        for (let media in breakpoint.names) {
            if (this.scenes[media] && this.scenes[media].length && this.scenes[media][0].destroy) {
                for (let i = 0; i < this.scenes[media].length; i++) {
                    this.scenes[media][i].destroy();
                    this.scenes[media][i] = null;
                }
            }
        }
        for (let i = 0; i < this.timeLines.length; i++) {
            this.timeLines[i] = null;
        }
        this.controller.destroy();
        this.controller = null;
    }

    handleMediaChange(media) {
        for (let name in breakpoint.names) {
            this.setScenes(name, false);
        }
        if (this.props.transition.scrollScenesEnabled == true) {
            this.setScenes(media.current, true);
        }

        let initialScroll = this.props.getInitialScroll(),
            menuIsOpen = this.article.hasClass('menu-open'),
            contactIsOpen = this.article.hasClass('contact-open');

        if (media.current == breakpoint.names.large) {
            if (this.props.isHomepage) {
                if (menuIsOpen) {
                    if(contactIsOpen){
                        this.hideBurgerLeftInstant();
                        this.hideCloseLeftInstant();
                        this.article.removeClass('menu-open');
                        this.hamburger.removeClass('active');
                    }
                    else{
                        this.hideBurgerLeftInstant();
                        this.hideCloseLeftInstant();
                        this.article.removeClass('menu-open');
                        this.hamburger.removeClass('active');
                    }
                }
                else {
                    this.hideBurgerLeftInstant();
                    this.hideCloseLeftInstant();
                    this.hamburger.removeClass('active');
                }

            }
            //generic page
            else{
                if (menuIsOpen) {
                    if(contactIsOpen){
                        if(initialScroll == 0){
                            this.hideBurgerLeftInstant();
                            this.hideCloseLeftInstant();
                            this.article.removeClass('menu-open');
                            this.hamburger.removeClass('active');
                        }
                        else {
                            this.hideBurgerLeftInstant();
                            this.hideCloseLeftInstant();
                        }
                    }
                    else{
                        this.hideBurgerLeftInstant();
                    }
                }
                else {
                    if (initialScroll == 0) {
                        this.hamburger.removeClass('active');
                        this.hideBurgerLeftInstant();
                        this.hideCloseLeftInstant();
                    } else if (initialScroll < 355) {
                        this.hideCloseLeftInstant();
                    } else {
                        this.darkInstant();
                        this.hideCloseLeftInstant();
                    }
                }
            }
        } else if (media.current != breakpoint.names.none) {
            if (menuIsOpen) {
                if(contactIsOpen){
                    this.hideBurgerRightInstant();
                    this.hideCloseRightInstant();
                    this.lightInstant();
                }
                else {
                    this.hideBurgerRightInstant();
                    this.lightInstant();
                }
            } else {
                if(contactIsOpen){
                    this.article.addClass('menu-open');
                    this.hamburger.addClass('active');
                    this.hideCloseRightInstant();
                    this.hideBurgerRightInstant();
                }
                else{
                    this.hamburger.addClass('active');
                    this.showBurgerInstant();
                    this.hideCloseRightInstant();
                }
            }
        }
    }

    setScenes(media, enabled, args = []) {
        //console.warn('logo setting scenes for', media, 'to', enabled,'on', this.article.attr('class'));
        this.scenes && this.scenes[media] && this.scenes[media].forEach(scene => { scene.enabled(enabled); scene.trigger(enabled ? 'enabled' : 'disabled', args); });
    }

    open() {
        if (this.inProgress) return false;
        this.inProgress = true;

        this.initialScroll = $window.scrollTop();
        this.initialHeight = 400 - this.initialScroll;
        this.props.setInitialScroll(this.initialScroll);
        this.props.disableScenes();
        $.scrollLock(true);

        let color = '#fefefe';
        this.prevColor = this.burger.css('color');
        let isLarge = this.props.ui.media.current == breakpoint.names.large;
        let isSmall = this.props.ui.media.current == breakpoint.names.small;

        this.wasFixedBurger = this.article.hasClass('fix-header');
        this.wasFixedBurger && TweenMax.set(this.text, { x: '-100%' });
        this.wasFixedBurger && TweenMax.set(this.image, { scale: 1.1, opacity: 0 });

        if (this.props.isHomepage) {
            let timeline = new TimelineLite({ onComplete: onComplete.bind(this, timeline) })
                .add(_.filter([
                    TweenMax.to(this.homeBottom, .3, { y: '200%' }),
                    TweenMax.to(this.homeImage, .3, { scale: 1.1, opacity: 0 }),
                    !isSmall && TweenMax.to(this.homeLeft, .3, { x: '-105%' }),
                    !isSmall && TweenMax.to(this.homeRight, .3, { x: '105%' }),
                    isSmall && TweenMax.to(this.smallHomeLeft, .3, { x: '-105%' }),
                    TweenMax.to(this.burger, .3, { x: '105%', ease: Power3.easeOut }),
                ]))
                .add((() => {
                    this.article.addClass('menu-open');
                    TweenMax.set(this.header, { height: '100%' });
                }).bind(this))
                .add(_.filter([
                    TweenMax.to(this.logoText, .3, { x: '0%', ease: Power3.easeOut }),
                    TweenMax.to(this.close, .3, { x: '0%', ease: Power3.easeOut }),
                    TweenMax.to(this.links, .3, { x: '0%', ease: Power3.easeOut }),
                ]));
        } else {
            let timeline = new TimelineLite({ onComplete: onComplete.bind(this, timeline) })
                .add(_.filter([
                    !this.wasFixedBurger && TweenMax.to(this.text, .3, { x: '-100%', ease: Power3.easeOut }),
                    !this.wasFixedBurger && TweenMax.to(this.image, .3, { scale: 1.1, opacity: 0, ease: Power3.easeOut }),
                ]))
                .add((() => {
                    this.article.addClass('fix-header');
                    !this.wasFixedBurger && this.header.height(this.initialHeight);
                }).bind(this))
                .add(_.filter([
                    TweenMax.to(this.burger, .3, { x: isLarge ? '-100%' : '105%', ease: Power3.easeOut }),
                    TweenMax.to(this.logoImage, .3, { color: color, ease: Power3.easeOut }),
                    TweenMax.to(this.header, .6, { height: '100%', ease: Power3.easeOut }),
                ]))
                .add((() => {
                    this.article.addClass('menu-open');
                }).bind(this))
                .add(_.filter([
                    TweenMax.to(this.logoText, .3, { x: '0%', ease: Power3.easeOut }),
                    TweenMax.to(this.close, .3, { x: '0%', ease: Power3.easeOut }),
                    TweenMax.to(this.links, .3, { x: '0%', ease: Power3.easeOut }),
                ]));
        }

        function onComplete(timeline) {
            this.inProgress = false;
            timeline = null; //cleanup
        }
    }

    close() {
        if (this.inProgress) return false;
        this.inProgress = true;

        let isLarge = this.props.ui.media.current == breakpoint.names.large;
        let isMedium = this.props.ui.media.current == breakpoint.names.medium;
        let isSmall = this.props.ui.media.current == breakpoint.names.small;

        if (this.props.isHomepage) {
            let timeline = new TimelineLite({ onComplete: onComplete.bind(this, timeline) })
                .add(_.filter([
                    !isMedium && TweenMax.to(this.logoText, .3, { x: '-100%', ease: Power3.easeOut }),
                    TweenMax.to(this.close, .3, { x: '105%', ease: Power3.easeOut }),
                    TweenMax.to(this.links, .3, { x: '-100%', ease: Power3.easeOut }),
                ]))
                .add((() => {
                    this.article.removeClass('menu-open');
                    TweenMax.set(this.header, { clearProps: 'height' });
                }).bind(this))
                .add(_.filter([
                    TweenMax.to(this.homeBottom, .3, { y: '0%' }),
                    TweenMax.to(this.homeImage, .3, { scale: 1, opacity: 1 }),
                    !isSmall && TweenMax.to(this.homeLeft, .3, { x: '0%' }),
                    !isSmall && TweenMax.to(this.homeRight, .3, { x: '0%' }),
                    isSmall && TweenMax.to(this.smallHomeLeft, .3, { x: '0%' }),
                    TweenMax.to(this.burger, .3, { x: '0%', ease: Power3.easeOut }),
                ]));
        } else {
            if (typeof(this.initialHeight) === 'undefined') {
                //we're closing but we weren't opened via burger, but via a directly opened contact then resize
                this.initialHeight = 400; //can't directly open contact unless scroll is 0
                this.wasFixedBurger = false; //same logic as above
            }
            let timeline = new TimelineLite({ onComplete: onComplete.bind(this, timeline) })
                .add(_.filter([
                    TweenMax.to(this.links, .3, { x: '-100%', ease: Power3.easeIn }),
                    TweenMax.to(this.close, .3, { x: isLarge ? '-100%' : '105%', ease: Power3.easeIn }),
                    !isMedium && (!isLarge || this.initialScroll > 0) && TweenMax.to(this.logoText, .3, { x: '-100%', ease: Power3.easeIn }),
                ]))
                .add(_.filter([
                    this.wasFixedBurger && TweenMax.to(this.burger, .3, { x: '0%', delay: .3, ease: Power3.easeOut }),
                    isLarge && TweenMax.to(this.logoImage, .3, { color: this.prevColor, delay: .3, ease: Power3.easeOut }),
                    TweenMax.to(this.header, .6, { height: this.wasFixedBurger ? '0%' : this.initialHeight, ease: Power3.easeOut }),
                ]))
                .add(() => {
                    !this.wasFixedBurger && this.article.removeClass('fix-header');
                    TweenMax.set(this.header, { clearProps: 'height' });
                    this.wasFixedBurger && TweenMax.set(this.text, { clearProps: 'transform' });
                    this.wasFixedBurger && TweenMax.set(this.image, { clearProps: 'transform,opacity' });
                })
                .add(_.filter([
                    !this.wasFixedBurger && (!isLarge || this.initialScroll > 0) && TweenMax.to(this.burger, .3, { x: '0%', ease: Power3.easeOut }),
                    isLarge && !this.initialScroll && TweenMax.to(this.links, .3, { x: '0%', ease: Power3.easeOut }),
                    !this.wasFixedBurger && TweenMax.to(this.text, .3, { x: '0%', ease: Power3.easeOut }),
                    !this.wasFixedBurger && TweenMax.to(this.image, .3, { scale: 1, opacity: 1, ease: Power3.easeOut }),
                ]));
        }

        function onComplete(timeline) {
            $.scrollLock(false);
            this.article.removeClass('menu-open');
            if (isLarge && (this.props.isHomepage || !this.initialScroll)) {
                this.hamburger.removeClass('active');
            }
            setTimeout((() => {
                this.props.enableScenes();
                this.inProgress = false;
            }).bind(this), 100);
            timeline = null;
        }
    }

    render() {
        return (
            <div className="hamburger" ref="hamburger">
                <i className="open ncs-bars"  onClick={this.open} ref="burger" />
                <i className="close ncs-chevron-with-circle-left" onClick={this.close} ref="close" />
            </div>
        );
    }

    showBurgerFromLeft() {
        let t = TweenMax.to(this.burger, .3, { x: '0%' });
        this.timeLines.push(t);
        return t;
    }
    hideBurgerToLeft() {
        let t = TweenMax.to(this.burger, .3, { x: '-100%' });
        this.timeLines.push(t);
        return t;
    }
    showBurgerFromRight() {
        let t = TweenMax.fromTo(this.burger, .3, { x: '105%' }, { x: '0%' });
        this.timeLines.push(t);
        return t;
    }

    showBurgerInstant() {
        let t = TweenMax.set(this.burger, { x: '0%' });
        this.timeLines.push(t);
        return t;
    }
    hideBurgerLeftInstant() {
        let t = TweenMax.set(this.burger, { x: '-100%' });
        this.timeLines.push(t);
        return t;
    }
    hideBurgerRightInstant() {
        let t = TweenMax.set(this.burger, { x: '105%' });
        this.timeLines.push(t);
        return t;
    }

    showCloseInstant() {
        let t = TweenMax.set(this.close, { x: '0%' });
        this.timeLines.push(t);
        return t;
    }
    hideCloseLeftInstant() {
        let t = TweenMax.set(this.close, { x: '-100%' });
        this.timeLines.push(t);
        return t;
    }
    hideCloseRightInstant() {
        let t = TweenMax.set(this.close, { x: '105%' });
        this.timeLines.push(t);
        return t;
    }

    darken() {
        let t = TweenMax.fromTo(this.burger, .3, { color: '#fefefe' }, { color: '#4d4d4d' });
        this.timeLines.push(t);
        return t;
    }
    lightInstant() {
        let t = TweenMax.set(this.burger, { color: '#fefefe' });
        this.timeLines.push(t);
        return t;
    }
    darkInstant() {
        let t = TweenMax.set(this.burger, { color: '#4d4d4d' });
        this.timeLines.push(t);
        return t;
    }
}
