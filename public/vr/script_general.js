(function () {
    var c = {};
    function trans(e, f) {
        var g = arguments['length'] === 0x1 ? [arguments[0x0]] : Array['apply'](null, arguments);
        c[g[0x0]] = g;
        return '';
    }
    function regTextVar(h, i) {
        var j = ![];
        i = i['toLowerCase']();
        var k = function () {
            var t = this['get']('data');
            t['updateText'](t['translateObjs'][h]);
        };
        var l = function (u) {
            var v = u['data']['nextSelectedIndex'];
            if (v >= 0x0) {
                var w = u['source']['get']('items')[v];
                var x = function () {
                    w['unbind']('begin', x, this);
                    k['call'](this);
                };
                w['bind']('begin', x, this);
            } else
                k['call'](this);
        };
        var m = function (y) {
            return function (z) {
                if (y in z) {
                    k['call'](this);
                }
            }['bind'](this);
        };
        var n = function (A, B) {
            return function (C, D) {
                if (A == C && B in D) {
                    k['call'](this);
                }
            }['bind'](this);
        };
        var o = function (E, F, G) {
            for (var H = 0x0; H < E['length']; ++H) {
                var I = E[H];
                var J = I['get']('selectedIndex');
                if (J >= 0x0) {
                    var K = F['split']('.');
                    var L = I['get']('items')[J];
                    if (G !== undefined && !G['call'](this, L))
                        continue;
                    for (var M = 0x0; M < K['length']; ++M) {
                        if (L == undefined)
                            return '';
                        L = 'get' in L ? L['get'](K[M]) : L[K[M]];
                    }
                    return L;
                }
            }
            return '';
        };
        var p = function (N) {
            var O = N['get']('player');
            return O !== undefined && O['get']('viewerArea') == this['MainViewer'];
        };
        switch (i) {
        case 'title':
        case 'subtitle':
            var r = function () {
                switch (i) {
                case 'title':
                    return 'media.label';
                case 'subtitle':
                    return 'media.data.subtitle';
                }
            }();
            if (r) {
                return function () {
                    var P = this['_getPlayListsWithViewer'](this['MainViewer']);
                    if (!j) {
                        for (var Q = 0x0; Q < P['length']; ++Q) {
                            P[Q]['bind']('changing', l, this);
                        }
                        j = !![];
                    }
                    return o['call'](this, P, r, p);
                };
            }
            break;
        default:
            if (i['startsWith']('quiz.') && 'Quiz' in TDV) {
                var s = undefined;
                var r = function () {
                    switch (i) {
                    case 'quiz.questions.answered':
                        return TDV['Quiz']['PROPERTY']['QUESTIONS_ANSWERED'];
                    case 'quiz.question.count':
                        return TDV['Quiz']['PROPERTY']['QUESTION_COUNT'];
                    case 'quiz.items.found':
                        return TDV['Quiz']['PROPERTY']['ITEMS_FOUND'];
                    case 'quiz.item.count':
                        return TDV['Quiz']['PROPERTY']['ITEM_COUNT'];
                    case 'quiz.score':
                        return TDV['Quiz']['PROPERTY']['SCORE'];
                    case 'quiz.score.total':
                        return TDV['Quiz']['PROPERTY']['TOTAL_SCORE'];
                    case 'quiz.time.remaining':
                        return TDV['Quiz']['PROPERTY']['REMAINING_TIME'];
                    case 'quiz.time.elapsed':
                        return TDV['Quiz']['PROPERTY']['ELAPSED_TIME'];
                    case 'quiz.time.limit':
                        return TDV['Quiz']['PROPERTY']['TIME_LIMIT'];
                    case 'quiz.media.items.found':
                        return TDV['Quiz']['PROPERTY']['PANORAMA_ITEMS_FOUND'];
                    case 'quiz.media.item.count':
                        return TDV['Quiz']['PROPERTY']['PANORAMA_ITEM_COUNT'];
                    case 'quiz.media.questions.answered':
                        return TDV['Quiz']['PROPERTY']['PANORAMA_QUESTIONS_ANSWERED'];
                    case 'quiz.media.question.count':
                        return TDV['Quiz']['PROPERTY']['PANORAMA_QUESTION_COUNT'];
                    case 'quiz.media.score':
                        return TDV['Quiz']['PROPERTY']['PANORAMA_SCORE'];
                    case 'quiz.media.score.total':
                        return TDV['Quiz']['PROPERTY']['PANORAMA_TOTAL_SCORE'];
                    case 'quiz.media.index':
                        return TDV['Quiz']['PROPERTY']['PANORAMA_INDEX'];
                    case 'quiz.media.count':
                        return TDV['Quiz']['PROPERTY']['PANORAMA_COUNT'];
                    case 'quiz.media.visited':
                        return TDV['Quiz']['PROPERTY']['PANORAMA_VISITED_COUNT'];
                    default:
                        var R = /quiz\.([\w_]+)\.(.+)/['exec'](i);
                        if (R !== undefined) {
                            s = R[0x1];
                            switch ('quiz.' + R[0x2]) {
                            case 'quiz.score':
                                return TDV['Quiz']['OBJECTIVE_PROPERTY']['SCORE'];
                            case 'quiz.score.total':
                                return TDV['Quiz']['OBJECTIVE_PROPERTY']['TOTAL_SCORE'];
                            case 'quiz.media.items.found':
                                return TDV['Quiz']['OBJECTIVE_PROPERTY']['PANORAMA_ITEMS_FOUND'];
                            case 'quiz.media.item.count':
                                return TDV['Quiz']['OBJECTIVE_PROPERTY']['PANORAMA_ITEM_COUNT'];
                            case 'quiz.media.questions.answered':
                                return TDV['Quiz']['OBJECTIVE_PROPERTY']['PANORAMA_QUESTIONS_ANSWERED'];
                            case 'quiz.media.question.count':
                                return TDV['Quiz']['OBJECTIVE_PROPERTY']['PANORAMA_QUESTION_COUNT'];
                            case 'quiz.questions.answered':
                                return TDV['Quiz']['OBJECTIVE_PROPERTY']['QUESTIONS_ANSWERED'];
                            case 'quiz.question.count':
                                return TDV['Quiz']['OBJECTIVE_PROPERTY']['QUESTION_COUNT'];
                            case 'quiz.items.found':
                                return TDV['Quiz']['OBJECTIVE_PROPERTY']['ITEMS_FOUND'];
                            case 'quiz.item.count':
                                return TDV['Quiz']['OBJECTIVE_PROPERTY']['ITEM_COUNT'];
                            case 'quiz.media.score':
                                return TDV['Quiz']['OBJECTIVE_PROPERTY']['PANORAMA_SCORE'];
                            case 'quiz.media.score.total':
                                return TDV['Quiz']['OBJECTIVE_PROPERTY']['PANORAMA_TOTAL_SCORE'];
                            }
                        }
                    }
                }();
                if (r) {
                    return function () {
                        var S = this['get']('data')['quiz'];
                        if (S) {
                            if (!j) {
                                if (s != undefined)
                                    S['bind'](TDV['Quiz']['EVENT_OBJECTIVE_PROPERTIES_CHANGE'], n['call'](this, s, r), this);
                                else
                                    S['bind'](TDV['Quiz']['EVENT_PROPERTIES_CHANGE'], m['call'](this, r), this);
                                j = !![];
                            }
                            try {
                                var T = s != undefined ? S['getObjective'](s, r) : S['get'](r);
                                if (r == TDV['Quiz']['PROPERTY']['PANORAMA_INDEX'])
                                    T += 0x1;
                                return T;
                            } catch (U) {
                                return undefined;
                            }
                        }
                    };
                }
            }
            break;
        }
        return '';
    }
    function createQuizConfig(player, V) {
        var W = {"objectives":[{"id":"score1","label":trans('score1.label'),"initialScore":10,"visibleInScore":true}],"question":{"id":"quizQuestion_8382E868_9732_E133_41A3_4A7F4B9E10E9","responseDisplayTime":0,"ok":trans('quizQuestion_8382E868_9732_E133_41A3_4A7F4B9E10E9.ok')},"score":{"id":"quizScore_8380C868_9732_E133_41E1_9CA79513BBFB","downloadCSV":{"label":trans('quizScore_8380C868_9732_E133_41E1_9CA79513BBFB.downloadCSV','quizScore_8380C868_9732_E133_41E1_9CA79513BBFB.downloadCSV.label'),"visible":false},"title":trans('quizScore_8380C868_9732_E133_41E1_9CA79513BBFB.title'),"questions":{"label":trans('quizScore_8380C868_9732_E133_41E1_9CA79513BBFB.questions','quizScore_8380C868_9732_E133_41E1_9CA79513BBFB.questions.label'),"incorrectLabel":trans('quizScore_8380C868_9732_E133_41E1_9CA79513BBFB.questionsIncorrect','quizScore_8380C868_9732_E133_41E1_9CA79513BBFB.questions.incorrectLabel'),"visible":true,"correctLabel":trans('quizScore_8380C868_9732_E133_41E1_9CA79513BBFB.questionsCorrect','quizScore_8380C868_9732_E133_41E1_9CA79513BBFB.questions.correctLabel')},"canClose":true,"repeat":{"label":trans('quizScore_8380C868_9732_E133_41E1_9CA79513BBFB.repeat','quizScore_8380C868_9732_E133_41E1_9CA79513BBFB.repeat.label'),"visible":false},"items":{"label":trans('quizScore_8380C868_9732_E133_41E1_9CA79513BBFB.items','quizScore_8380C868_9732_E133_41E1_9CA79513BBFB.items.label'),"visible":true},"completion":{"label":trans('quizScore_8380C868_9732_E133_41E1_9CA79513BBFB.completion','quizScore_8380C868_9732_E133_41E1_9CA79513BBFB.completion.label'),"visible":true},"elapsedTime":{"label":trans('quizScore_8380C868_9732_E133_41E1_9CA79513BBFB.elapsedTime','quizScore_8380C868_9732_E133_41E1_9CA79513BBFB.elapsedTime.label'),"visible":true},"submitToLMS":{"label":trans('quizScore_8380C868_9732_E133_41E1_9CA79513BBFB.submitToLMS','quizScore_8380C868_9732_E133_41E1_9CA79513BBFB.submitToLMS.label'),"visible":false}},"timeLimit":-1,"theme":{"timeout":{},"question":{"window":{"mediaContainer":{"panoramaPlayer":{"touchControlMode":"drag_rotation","mouseControlMode":"drag_rotation"}}}},"score":{}},"timeout":{"id":"quizTimeout_8383F868_9732_E133_41DC_392EF68A3240","title":trans('quizTimeout_8383F868_9732_E133_41DC_392EF68A3240.title'),"score":{"label":trans('quizTimeout_8383F868_9732_E133_41DC_392EF68A3240.score','quizTimeout_8383F868_9732_E133_41DC_392EF68A3240.score.label'),"visible":true},"repeat":{"label":trans('quizTimeout_8383F868_9732_E133_41DC_392EF68A3240.repeat','quizTimeout_8383F868_9732_E133_41DC_392EF68A3240.repeat.label'),"visible":false}},"autoFinish":true};
        W['player'] = player;
        W['playList'] = V;
        function X(a0) {
            for (var a1 = 0x0; a1 < a0['length']; ++a1) {
                var a2 = a0[a1];
                if ('id' in a2)
                    player[a2['id']] = a2;
            }
        }
        if (W['questions']) {
            X(W['questions']);
            for (var Y = 0x0; Y < W['questions']['length']; ++Y) {
                var Z = W['questions'][Y];
                X(Z['options']);
            }
        }
        if (W['objectives']) {
            X(W['objectives']);
        }
        if (W['califications']) {
            X(W['califications']);
        }
        if (W['score']) {
            player[W['score']['id']] = W['score'];
        }
        if (W['question']) {
            player[W['question']['id']] = W['question'];
        }
        if (W['timeout']) {
            player[W['timeout']['id']] = W['timeout'];
        }
        player['get']('data')['translateObjs'] = c;
        return W;
    }
    var d = {"horizontalAlign":"left","minHeight":20,"start":"this.init(); this.initQuiz(this.createQuizConfig(this.rootPlayer, this.mainPlayList), true, true); var quiz = this.get('data')['quiz']; quiz.bind('propertiesChange', (function() { var functionCallee = function(properties){ if(TDV.Quiz.PROPERTY.ITEMS_FOUND in properties) { var value = quiz.get(TDV.Quiz.PROPERTY.ITEMS_FOUND);  if(value == 10) { this.showWindow(this.window_84FF791D_9792_96DD_41D6_A573105D722B, null, false);quiz.unbind('propertiesChange', functionCallee); }  }  }.bind(this); return functionCallee }.bind(this))())","minWidth":20,"borderSize":0,"paddingRight":0,"borderRadius":0,"shadow":false,"propagateClick":true,"scrollBarOpacity":0.5,"scrollBarMargin":2,"overflow":"hidden","scrollBarVisible":"rollOver","defaultVRPointer":"laser","scrollBarWidth":10,"width":"100%","definitions": [{"id":"album_C1DF5BFE_9318_A7E4_4177_BEB1B324AC59","data":{"label":"Photo Album high-desert-health-system-3-3-4"},"label":trans('album_C1DF5BFE_9318_A7E4_4177_BEB1B324AC59.label'),"loop":false,"playList":"this.album_C1DF5BFE_9318_A7E4_4177_BEB1B324AC59_AlbumPlayList","class":"PhotoAlbum","thumbnailUrl":"media/album_C1DF5BFE_9318_A7E4_4177_BEB1B324AC59_t.png"},{"id":"album_C1DF5BFE_9318_A7E4_4177_BEB1B324AC59_1","height":540,"data":{"label":"high-desert-health-system-3-4"},"label":trans('album_C1DF5BFE_9318_A7E4_4177_BEB1B324AC59_1.label'),"thumbnailUrl":"media/album_C1DF5BFE_9318_A7E4_4177_BEB1B324AC59_1_t.png","width":720,"image":{"class":"ImageResource","levels":[{"class":"ImageResourceLevel","url":"media/album_C1DF5BFE_9318_A7E4_4177_BEB1B324AC59_1.png"}]},"duration":5000,"class":"Photo"},{"id":"album_F48055FD_9319_E3E4_41DE_95B2FE75860A_0","height":540,"data":{"label":"ny-hospital0covid-19-3-4"},"label":trans('album_F48055FD_9319_E3E4_41DE_95B2FE75860A_0.label'),"thumbnailUrl":"media/album_F48055FD_9319_E3E4_41DE_95B2FE75860A_0_t.png","width":720,"image":{"class":"ImageResource","levels":[{"class":"ImageResourceLevel","url":"media/album_F48055FD_9319_E3E4_41DE_95B2FE75860A_0.png"}]},"duration":5000,"class":"Photo"},{"bottom":"9.97%","minHeight":1,"minWidth":1,"insetBorder":false,"borderSize":0,"paddingRight":0,"borderRadius":0,"shadow":false,"right":"8.83%","propagateClick":false,"backgroundColorRatios":[0],"width":"77.067%","class":"WebFrame","backgroundColor":["#FFFFFF"],"id":"WebFrame_8601FE52_97EF_49A6_4193_859EDE655079","height":"73.996%","scrollEnabled":true,"paddingLeft":0,"url":"https://web.microsoftstream.com/embed/video/b4a968df-d93d-426b-903b-996af3761015?autoplay=true&amp;showinfo=true","paddingTop":0,"paddingBottom":0,"toolTipHorizontalAlign":"center","backgroundOpacity":1,"backgroundColorDirection":"vertical","data":{"name":"WebFrame8109"}},{"id":"effect_8C2C99CC_983F_4AA2_41DB_DB135995CA93","class":"FadeOutEffect","duration":500,"easing":"linear"},{"id":"album_C1DF5BFE_9318_A7E4_4177_BEB1B324AC59_0","height":540,"data":{"label":"high-desert-health-system-3-3-4"},"label":trans('album_C1DF5BFE_9318_A7E4_4177_BEB1B324AC59_0.label'),"thumbnailUrl":"media/album_C1DF5BFE_9318_A7E4_4177_BEB1B324AC59_0_t.jpg","width":720,"image":{"class":"ImageResource","levels":[{"class":"ImageResourceLevel","url":"media/album_C1DF5BFE_9318_A7E4_4177_BEB1B324AC59_0.jpg"}]},"duration":5000,"class":"Photo"},{"id":"effect_8C845B6D_983B_4E62_41C8_65BBA17CB56A","class":"FadeInEffect","duration":500,"easing":"linear"},{"closeButtonPaddingTop":5,"titlePaddingBottom":5,"footerBackgroundOpacity":1,"headerPaddingLeft":10,"shadow":false,"propagateClick":false,"scrollBarOpacity":0.5,"closeButtonIconColor":"#FFFFFF","bodyBackgroundColorRatios":[0,0.5,1],"veilOpacity":0.5,"modal":true,"footerHeight":5,"contentOpaque":false,"headerBackgroundColor":["#DDDDDD","#EEEEEE","#FFFFFF"],"closeButtonPressedBorderColor":"#000000","closeButtonBackgroundColor":["#003478"],"bodyPaddingLeft":10,"class":"Window","backgroundColor":[],"headerPaddingTop":10,"closeButtonPressedBorderSize":0,"children":["this.htmlText_8111496C_9731_6333_41CD_B9423DCA55E3"],"closeButtonBackgroundOpacity":0.8,"paddingLeft":0,"closeButtonRollOverIconColor":"#FFFFFF","headerVerticalAlign":"middle","closeButtonIconWidth":40,"closeButtonIconHeight":40,"closeButtonPressedIconColor":"#FFFFFF","closeButtonBackgroundColorRatios":[0.79],"bodyPaddingTop":10,"closeButtonPaddingRight":5,"bodyPaddingRight":10,"bodyPaddingBottom":10,"titleFontColor":"#003478","titlePaddingTop":5,"layout":"vertical","closeButtonRollOverBackgroundOpacity":0.8,"closeButtonPressedBackgroundColor":["#003478"],"backgroundColorDirection":"vertical","closeButtonPressedBackgroundColorRatios":[0],"closeButtonRollOverBorderColor":"#000000","headerBackgroundOpacity":1,"backgroundOpacity":1,"closeButtonRollOverBackgroundColor":["#004378"],"hideEffect":{"class":"FadeOutEffect","duration":500,"easing":"cubic_in_out"},"minHeight":20,"borderSize":0,"minWidth":20,"paddingRight":0,"borderRadius":5,"headerBackgroundColorDirection":"vertical","overflow":"scroll","showEffect":{"class":"FadeInEffect","duration":500,"easing":"cubic_in_out"},"titlePaddingRight":5,"scrollBarVisible":"rollOver","veilColor":["#000000"],"scrollBarMargin":2,"headerPaddingBottom":10,"closeButtonBorderRadius":0,"backgroundColorRatios":[],"closeButtonPressedIconLineWidth":2,"bodyBackgroundColor":["#FFFFFF","#DDDDDD","#FFFFFF"],"bodyBackgroundOpacity":1,"scrollBarWidth":10,"closeButtonRollOverBorderSize":0,"width":400,"bodyBackgroundColorDirection":"vertical","closeButtonIconLineWidth":4,"footerBackgroundColorRatios":[0,0.9,1],"closeButtonRollOverIconLineWidth":2,"closeButtonRollOverBackgroundColorRatios":[0],"id":"window_84FF791D_9792_96DD_41D6_A573105D722B","veilColorRatios":[1],"titleFontFamily":"Source Sans Pro SemiBold","height":300,"closeButtonPressedBackgroundOpacity":0.8,"titlePaddingLeft":5,"paddingTop":0,"veilHideEffect":{"class":"FadeOutEffect","duration":500,"easing":"cubic_in_out"},"closeButtonBorderColor":"#000000","closeButtonPaddingBottom":5,"headerPaddingRight":10,"paddingBottom":0,"veilColorDirection":"horizontal","closeButtonPaddingLeft":5,"toolTipHorizontalAlign":"center","closeButtonBorderSize":0,"scrollBarColor":"#000000","titleFontSize":"3vmin","gap":10,"headerBackgroundColorRatios":[0,0.1,1],"verticalAlign":"middle","footerBackgroundColorDirection":"vertical","data":{"name":"Window10294"},"footerBackgroundColor":["#FFFFFF","#EEEEEE","#DDDDDD"],"veilShowEffect":{"class":"FadeInEffect","duration":500,"easing":"cubic_in_out"},"horizontalAlign":"center"},{"id":"MainViewerPanoramaPlayer","arrowKeysAction":"translate","mouseControlMode":"drag_rotation","touchControlMode":"drag_rotation","displayPlaybackBar":true,"viewerArea":"this.MainViewer","class":"PanoramaPlayer","gyroscopeVerticalDraggingEnabled":true},{"cursor":"hand","horizontalAlign":"center","fontSize":"1.29vmin","data":{"name":"CloseButton10275"},"minHeight":1,"borderSize":0,"shadowBlurRadius":6,"minWidth":1,"shadowSpread":1,"paddingRight":5,"borderRadius":0,"fontFamily":"Arial","shadow":false,"right":"10.84%","fontStyle":"normal","propagateClick":false,"rollOverIconColor":"#666666","pressedIconColor":"#888888","backgroundColorRatios":[0,0.1,1],"borderColor":"#000000","shadowColor":"#000000","iconHeight":"100%","width":40,"class":"CloseButton","backgroundColor":["#DDDDDD","#EEEEEE","#FFFFFF"],"id":"CloseButton_84AC5410_97DF_39A2_41A9_C463052AC8A9","height":40,"click":"this.setComponentVisibility(this.Container_85BEEB8C_97E5_4EA2_41DC_7073E19FEC87, false, 0, this.effect_8CB7D2CD_9825_3EA2_41E2_A6F553DC9F27, 'hideEffect', false)","mode":"push","fontColor":"#FFFFFF","paddingLeft":5,"iconLineWidth":5,"paddingTop":5,"paddingBottom":5,"layout":"horizontal","toolTipHorizontalAlign":"center","iconColor":"#000000","top":"20.36%","verticalAlign":"middle","backgroundOpacity":0.3,"backgroundColorDirection":"vertical","fontWeight":"normal","textDecoration":"none","gap":5,"iconWidth":"100%"},{"id":"album_839D789B_9656_A9BE_41DD_39EACDE9C3A2","data":{"label":"NY hospital mobile"},"label":trans('album_839D789B_9656_A9BE_41DD_39EACDE9C3A2.label'),"loop":false,"playList":"this.album_839D789B_9656_A9BE_41DD_39EACDE9C3A2_AlbumPlayList","class":"PhotoAlbum","thumbnailUrl":"media/album_839D789B_9656_A9BE_41DD_39EACDE9C3A2_t.png"},{"id":"album_80624564_9651_D88A_41E1_EF30FCAC3C6D","data":{"label":"High Desert mobile"},"label":trans('album_80624564_9651_D88A_41E1_EF30FCAC3C6D.label'),"loop":false,"playList":"this.album_80624564_9651_D88A_41E1_EF30FCAC3C6D_AlbumPlayList","class":"PhotoAlbum","thumbnailUrl":"media/album_80624564_9651_D88A_41E1_EF30FCAC3C6D_t.png"},{"id":"mainPlayList","class":"PlayList","items":[{"end":"this.trigger('tourEnded')","player":"this.MainViewerPanoramaPlayer","camera":"this.panorama_884849D0_820C_B433_41D3_1E415BA03DC3_camera","class":"PanoramaPlayListItem","media":"this.panorama_884849D0_820C_B433_41D3_1E415BA03DC3"}]},{"toolTipFontFamily":"Source Sans Pro Black","playbackBarProgressBackgroundColorRatios":[0],"progressBarBackgroundColor":["#3399FF"],"progressBackgroundColor":["#FFFFFF"],"left":0,"progressBarOpacity":1,"subtitlesFontSize":"3vmin","toolTipBorderColor":"#767676","shadow":false,"toolTipFontStyle":"normal","playbackBarBorderColor":"#FFFFFF","propagateClick":true,"toolTipTextShadowBlurRadius":3,"progressBottom":55,"vrPointerSelectionColor":"#FF6600","progressHeight":6,"toolTipBorderSize":0,"progressBackgroundOpacity":1,"progressBorderSize":0,"subtitlesFontWeight":"normal","playbackBarBorderRadius":0,"progressBarBorderRadius":0,"toolTipBackgroundColor":"#FFFFFF","playbackBarProgressBorderColor":"#000000","progressBarBorderSize":6,"subtitlesPaddingBottom":5,"playbackBarHeadBorderRadius":0,"subtitlesBackgroundOpacity":0.2,"playbackBarProgressOpacity":1,"class":"ViewerArea","subtitlesBottom":50,"subtitlesBorderColor":"#FFFFFF","subtitlesPaddingLeft":5,"toolTipShadowOpacity":0,"playbackBarHeadBorderColor":"#000000","toolTipPaddingTop":10,"subtitlesTextDecoration":"none","subtitlesFontColor":"#FFFFFF","subtitlesTextShadowBlurRadius":0,"paddingLeft":0,"toolTipOpacity":0.8,"subtitlesPaddingRight":5,"progressBorderRadius":0,"toolTipShadowBlurRadius":3,"transitionDuration":500,"playbackBarHeadShadowBlurRadius":3,"subtitlesFontFamily":"Arial","playbackBarLeft":0,"playbackBarBorderSize":0,"playbackBarHeadHeight":15,"progressLeft":0,"toolTipPaddingLeft":10,"top":0,"toolTipDisplayTime":600,"toolTipFontSize":"1.5vw","playbackBarHeadShadowColor":"#000000","firstTransitionDuration":0,"playbackBarHeadBackgroundColorRatios":[0,1],"doubleClickAction":"toggle_fullscreen","toolTipFontWeight":"normal","subtitlesShadow":false,"playbackBarHeadBorderSize":0,"playbackBarHeadShadow":true,"playbackBarHeadOpacity":1,"subtitlesPaddingTop":5,"vrPointerColor":"#FFFFFF","minHeight":50,"minWidth":100,"toolTipPaddingRight":10,"subtitlesOpacity":1,"borderSize":0,"paddingRight":0,"borderRadius":0,"toolTipShadowSpread":0,"toolTipTextShadowOpacity":0,"playbackBarHeadShadowHorizontalLength":0,"toolTipTextShadowColor":"#000000","progressBackgroundColorRatios":[0.01],"playbackBarOpacity":1,"subtitlesGap":0,"subtitlesBackgroundColor":"#000000","playbackBarHeadBackgroundColor":["#111111","#666666"],"subtitlesTextShadowHorizontalLength":1,"toolTipBorderRadius":10,"progressOpacity":1,"vrPointerSelectionTime":2000,"progressRight":0,"progressBarBackgroundColorDirection":"vertical","playbackBarBottom":5,"progressBarBorderColor":"#0066FF","width":"100%","progressBarBackgroundColorRatios":[0],"playbackBarProgressBackgroundColorDirection":"vertical","subtitlesHorizontalAlign":"center","id":"MainViewer","subtitlesTextShadowVerticalLength":1,"subtitlesVerticalAlign":"bottom","playbackBarHeight":10,"toolTipFontColor":"#003478","playbackBarHeadBackgroundColorDirection":"vertical","height":"100%","transitionMode":"blending","playbackBarBackgroundColor":["#FFFFFF"],"paddingTop":0,"playbackBarProgressBorderSize":0,"playbackBarHeadWidth":6,"playbackBarBackgroundColorDirection":"vertical","subtitlesTextShadowOpacity":1,"paddingBottom":0,"toolTipPaddingBottom":10,"playbackBarProgressBorderRadius":0,"toolTipHorizontalAlign":"center","playbackBarRight":0,"playbackBarHeadShadowVerticalLength":0,"playbackBarProgressBackgroundColor":["#3399FF"],"progressBackgroundColorDirection":"vertical","subtitlesTextShadowColor":"#000000","subtitlesBorderSize":0,"subtitlesTop":0,"playbackBarBackgroundOpacity":1,"playbackBarHeadShadowOpacity":0.7,"data":{"name":"Main Viewer"},"displayTooltipInTouchScreens":true,"toolTipShadowColor":"#333333","progressBorderColor":"#FFFFFF"},{"id":"effect_8C2C89CC_983F_4AA2_41D5_9A1796192CAB","class":"FadeInEffect","duration":500,"easing":"linear"},{"id":"effect_8CB7D2CD_9825_3EA2_41E2_A6F553DC9F27","class":"FadeOutEffect","duration":500,"easing":"linear"},{"id":"panorama_884849D0_820C_B433_41D3_1E415BA03DC3_camera","initialPosition":{"class":"PanoramaCameraPosition","yaw":-67.75,"pitch":-6.25},"automaticZoomSpeed":10,"class":"PanoramaCamera"},{"horizontalAlign":"left","bottom":"1.47%","minHeight":1,"minWidth":1,"borderSize":0,"paddingRight":0,"borderRadius":0,"shadow":false,"right":"1.42%","propagateClick":false,"scrollBarOpacity":0.5,"scrollBarMargin":2,"overflow":"scroll","backgroundColorRatios":[0],"scrollBarVisible":"rollOver","scrollBarWidth":10,"width":"96.56%","contentOpaque":false,"class":"Container","backgroundColor":["#000000"],"id":"Container_85BEEB8C_97E5_4EA2_41DC_7073E19FEC87","height":"96.695%","children":["this.WebFrame_8601FE52_97EF_49A6_4193_859EDE655079","this.CloseButton_84AC5410_97DF_39A2_41A9_C463052AC8A9"],"paddingLeft":0,"paddingTop":0,"visible":false,"paddingBottom":0,"layout":"absolute","toolTipHorizontalAlign":"center","scrollBarColor":"#000000","gap":10,"verticalAlign":"top","backgroundOpacity":0.86,"backgroundColorDirection":"horizontal","data":{"name":"Container7541"}},{"id":"photo_83C6C7C8_9652_679A_41A6_CC0DC6ABBD9E","height":540,"data":{"label":"high-desert-health-system-2-3-4"},"label":trans('photo_83C6C7C8_9652_679A_41A6_CC0DC6ABBD9E.label'),"thumbnailUrl":"media/photo_83C6C7C8_9652_679A_41A6_CC0DC6ABBD9E_t.jpg","width":720,"image":{"class":"ImageResource","levels":[{"class":"ImageResourceLevel","url":"media/photo_83C6C7C8_9652_679A_41A6_CC0DC6ABBD9E.jpg"}]},"duration":5000,"class":"Photo"},{"id":"playList_8B985808_99F1_0ED9_41CF_3FF2D3EFE646","class":"PlayList","items":[{"class":"PhotoAlbumPlayListItem","player":"this.MainViewerPhotoAlbumPlayer","media":"this.album_F48055FD_9319_E3E4_41DE_95B2FE75860A"}]},{"id":"MainViewerPhotoAlbumPlayer","class":"PhotoAlbumPlayer","viewerArea":"this.MainViewer"},{"id":"photo_C4078376_931B_E0E4_41DD_284A569598F4","height":540,"data":{"label":"high-desert-health-system-2-3-4"},"label":trans('photo_C4078376_931B_E0E4_41DD_284A569598F4.label'),"thumbnailUrl":"media/photo_C4078376_931B_E0E4_41DD_284A569598F4_t.jpg","width":720,"image":{"class":"ImageResource","levels":[{"class":"ImageResourceLevel","url":"media/photo_C4078376_931B_E0E4_41DD_284A569598F4.jpg"}]},"duration":5000,"class":"Photo"},{"id":"playList_8B986808_99F1_0ED9_41D9_6DE1085279D0","class":"PlayList","items":[{"class":"PhotoAlbumPlayListItem","player":"this.MainViewerPhotoAlbumPlayer","media":"this.album_C1DF5BFE_9318_A7E4_4177_BEB1B324AC59"}]},{"id":"album_F48055FD_9319_E3E4_41DE_95B2FE75860A","data":{"label":"NY Hospital"},"label":trans('album_F48055FD_9319_E3E4_41DE_95B2FE75860A.label'),"loop":false,"playList":"this.album_F48055FD_9319_E3E4_41DE_95B2FE75860A_AlbumPlayList","class":"PhotoAlbum","thumbnailUrl":"media/album_F48055FD_9319_E3E4_41DE_95B2FE75860A_t.png"},{"id":"effect_8C847B6D_983B_4E62_41B0_F6C81E99BEC2","class":"FadeOutEffect","duration":500,"easing":"linear"},{"id":"panorama_884849D0_820C_B433_41D3_1E415BA03DC3","class":"Panorama","partial":false,"label":trans('panorama_884849D0_820C_B433_41D3_1E415BA03DC3.label'),"thumbnailUrl":"media/panorama_884849D0_820C_B433_41D3_1E415BA03DC3_t.jpg","vfov":180,"hfov":360,"hfovMin":"120%","pitch":0,"hfovMax":130,"overlays":["this.overlay_8FBE8E70_9BED_F004_41E1_E048C546DA2C","this.overlay_893C76E0_9BEB_B005_4161_38841457C750","this.overlay_8E22569B_983E_C6A6_41C8_CC19775D5E57"],"data":{"label":"TT Virtual Conference-VR-main-room"},"frames":[{"class":"CubicPanoramaFrame","thumbnailUrl":"media/panorama_884849D0_820C_B433_41D3_1E415BA03DC3_t.jpg","cube":{"class":"ImageResource","levels":[{"width":18432,"rowCount":6,"colCount":36,"class":"TiledImageResourceLevel","tags":"ondemand","height":3072,"url":"media/panorama_884849D0_820C_B433_41D3_1E415BA03DC3_0/{face}/0/{row}_{column}.jpg"},{"width":9216,"rowCount":3,"colCount":18,"class":"TiledImageResourceLevel","tags":"ondemand","height":1536,"url":"media/panorama_884849D0_820C_B433_41D3_1E415BA03DC3_0/{face}/1/{row}_{column}.jpg"},{"width":6144,"rowCount":2,"colCount":12,"class":"TiledImageResourceLevel","tags":"ondemand","height":1024,"url":"media/panorama_884849D0_820C_B433_41D3_1E415BA03DC3_0/{face}/2/{row}_{column}.jpg"},{"width":3072,"rowCount":1,"colCount":6,"class":"TiledImageResourceLevel","tags":["ondemand","preload"],"height":512,"url":"media/panorama_884849D0_820C_B433_41D3_1E415BA03DC3_0/{face}/3/{row}_{column}.jpg"},{"width":9216,"rowCount":1,"colCount":6,"class":"TiledImageResourceLevel","tags":"mobilevr","height":1536,"url":"media/panorama_884849D0_820C_B433_41D3_1E415BA03DC3_0/{face}/vr/0.jpg"}]}}]},{"id":"album_C1DF5BFE_9318_A7E4_4177_BEB1B324AC59_AlbumPlayList","class":"PhotoPlayList","items":[{"class":"PhotoPlayListItem","camera":{"scaleMode":"fit_to_height","class":"PhotoCamera"},"media":"this.album_C1DF5BFE_9318_A7E4_4177_BEB1B324AC59_1"},{"class":"PhotoPlayListItem","camera":{"scaleMode":"fit_to_height","class":"PhotoCamera"},"media":"this.photo_C4078376_931B_E0E4_41DD_284A569598F4"},{"class":"PhotoPlayListItem","camera":{"scaleMode":"fit_to_height","class":"PhotoCamera"},"media":"this.album_C1DF5BFE_9318_A7E4_4177_BEB1B324AC59_0"}]},{"minHeight":0,"borderSize":0,"minWidth":0,"paddingRight":10,"borderRadius":0,"scrollBarOpacity":0.5,"propagateClick":false,"shadow":false,"scrollBarMargin":2,"scrollBarWidth":10,"scrollBarVisible":"rollOver","width":"100%","class":"HTMLText","id":"htmlText_8111496C_9731_6333_41CD_B9423DCA55E3","height":"100%","paddingLeft":10,"paddingTop":10,"paddingBottom":10,"toolTipHorizontalAlign":"center","scrollBarColor":"#000000","html":trans('htmlText_8111496C_9731_6333_41CD_B9423DCA55E3.html'),"backgroundOpacity":0,"data":{"name":"HTMLText10295"}},{"id":"album_839D789B_9656_A9BE_41DD_39EACDE9C3A2_AlbumPlayList","class":"PhotoPlayList","items":[{"class":"PhotoPlayListItem","camera":{"scaleMode":"fit_outside","initialPosition":{"class":"PhotoCameraPosition","x":0.5,"y":0.5,"zoomFactor":1},"duration":5000,"easing":"linear","targetPosition":{"class":"PhotoCameraPosition","x":0.65,"y":0.38,"zoomFactor":1.1},"class":"MovementPhotoCamera"},"media":"this.album_839D789B_9656_A9BE_41DD_39EACDE9C3A2_0"}]},{"id":"album_80624564_9651_D88A_41E1_EF30FCAC3C6D_AlbumPlayList","class":"PhotoPlayList","items":[{"class":"PhotoPlayListItem","camera":{"scaleMode":"fit_outside","initialPosition":{"class":"PhotoCameraPosition","x":0.5,"y":0.5,"zoomFactor":1},"duration":5000,"easing":"linear","targetPosition":{"class":"PhotoCameraPosition","x":0.54,"y":0.43,"zoomFactor":1.1},"class":"MovementPhotoCamera"},"media":"this.album_80624564_9651_D88A_41E1_EF30FCAC3C6D_1"},{"class":"PhotoPlayListItem","camera":{"scaleMode":"fit_outside","initialPosition":{"class":"PhotoCameraPosition","x":0.5,"y":0.5,"zoomFactor":1},"duration":5000,"easing":"linear","targetPosition":{"class":"PhotoCameraPosition","x":0.7,"y":0.63,"zoomFactor":1.1},"class":"MovementPhotoCamera"},"media":"this.photo_83C6C7C8_9652_679A_41A6_CC0DC6ABBD9E"},{"class":"PhotoPlayListItem","camera":{"scaleMode":"fit_outside","initialPosition":{"class":"PhotoCameraPosition","x":0.5,"y":0.5,"zoomFactor":1},"duration":5000,"easing":"linear","targetPosition":{"class":"PhotoCameraPosition","x":0.45,"y":0.37,"zoomFactor":1.1},"class":"MovementPhotoCamera"},"media":"this.album_80624564_9651_D88A_41E1_EF30FCAC3C6D_0"}]},{"id":"album_F48055FD_9319_E3E4_41DE_95B2FE75860A_AlbumPlayList","class":"PhotoPlayList","items":[{"class":"PhotoPlayListItem","camera":{"scaleMode":"fit_outside","class":"PhotoCamera"},"media":"this.album_F48055FD_9319_E3E4_41DE_95B2FE75860A_0"}]},{"id":"overlay_8FBE8E70_9BED_F004_41E1_E048C546DA2C","areas":["this.HotspotPanoramaOverlayArea_8FBBCE83_9BED_F00B_41D7_A6D1993AF9EE"],"maps":[],"useHandCursor":true,"class":"HotspotPanoramaOverlay","items":[{"hfov":9.33,"data":{"label":"energy rollup"},"image":{"class":"ImageResource","levels":[{"width":212,"class":"ImageResourceLevel","height":664,"url":"media/panorama_884849D0_820C_B433_41D3_1E415BA03DC3_HS_piognvzf.png"}]},"distance":50,"pitch":-8.48,"roll":0,"class":"HotspotPanoramaOverlayImage","yaw":-15.79}],"data":{"label":"energy rollup"},"rollOverDisplay":true},{"id":"overlay_893C76E0_9BEB_B005_4161_38841457C750","areas":["this.HotspotPanoramaOverlayArea_88F1F6FE_9BEB_B1FC_41D8_32D624046D06"],"maps":[],"useHandCursor":true,"enabledInCardboard":true,"class":"HotspotPanoramaOverlay","items":[{"hfov":12.11,"data":{"label":"generic rollup"},"image":{"class":"ImageResource","levels":[{"width":276,"class":"ImageResourceLevel","height":744,"url":"media/panorama_884849D0_820C_B433_41D3_1E415BA03DC3_HS_icfd2e2y.png"}]},"distance":50,"pitch":-9.45,"roll":0,"class":"HotspotPanoramaOverlayImage","yaw":40.5}],"data":{"label":"generic rollup"},"rollOverDisplay":true},{"id":"overlay_8E22569B_983E_C6A6_41C8_CC19775D5E57","areas":["this.HotspotPanoramaOverlayArea_8E2316A3_983E_C6E5_41CB_30BB76B8ED08"],"maps":[],"useHandCursor":true,"class":"HotspotPanoramaOverlay","items":[{"hfov":29.73,"data":{"label":"Polygon"},"image":{"class":"ImageResource","levels":[{"width":692,"class":"ImageResourceLevel","height":348,"url":"media/panorama_884849D0_820C_B433_41D3_1E415BA03DC3_HS_8youap9r.png"}]},"distance":50,"pitch":-40.18,"roll":0,"class":"HotspotPanoramaOverlayImage","yaw":9.65}],"data":{"label":"Polygon"},"rollOverDisplay":false},{"id":"album_839D789B_9656_A9BE_41DD_39EACDE9C3A2_0","height":540,"data":{"label":"ny hospital mobile"},"label":trans('album_839D789B_9656_A9BE_41DD_39EACDE9C3A2_0.label'),"thumbnailUrl":"media/album_839D789B_9656_A9BE_41DD_39EACDE9C3A2_0_t.png","width":720,"image":{"class":"ImageResource","levels":[{"class":"ImageResourceLevel","url":"media/album_839D789B_9656_A9BE_41DD_39EACDE9C3A2_0.png"}]},"duration":5000,"class":"Photo"},{"id":"album_80624564_9651_D88A_41E1_EF30FCAC3C6D_1","height":540,"data":{"label":"high-desert-health-system-3-4"},"label":trans('album_80624564_9651_D88A_41E1_EF30FCAC3C6D_1.label'),"thumbnailUrl":"media/album_80624564_9651_D88A_41E1_EF30FCAC3C6D_1_t.png","width":720,"image":{"class":"ImageResource","levels":[{"class":"ImageResourceLevel","url":"media/album_80624564_9651_D88A_41E1_EF30FCAC3C6D_1.png"}]},"duration":5000,"class":"Photo"},{"id":"album_80624564_9651_D88A_41E1_EF30FCAC3C6D_0","height":540,"thumbnailUrl":"media/album_80624564_9651_D88A_41E1_EF30FCAC3C6D_0_t.jpg","width":720,"image":{"class":"ImageResource","levels":[{"class":"ImageResourceLevel","url":"media/album_80624564_9651_D88A_41E1_EF30FCAC3C6D_0.jpg"}]},"duration":5000,"class":"Photo"},{"id":"HotspotPanoramaOverlayArea_8FBBCE83_9BED_F00B_41D7_A6D1993AF9EE","click":"if(!this.Container_85BEEB8C_97E5_4EA2_41DC_7073E19FEC87.get('visible')){ this.setComponentVisibility(this.Container_85BEEB8C_97E5_4EA2_41DC_7073E19FEC87, true, 0, this.effect_8C845B6D_983B_4E62_41C8_65BBA17CB56A, 'showEffect', false) } else { this.setComponentVisibility(this.Container_85BEEB8C_97E5_4EA2_41DC_7073E19FEC87, false, 0, this.effect_8C847B6D_983B_4E62_41B0_F6C81E99BEC2, 'hideEffect', false) }","mapColor":"image","class":"HotspotPanoramaOverlayArea","toolTip":trans('HotspotPanoramaOverlayArea_8FBBCE83_9BED_F00B_41D7_A6D1993AF9EE.toolTip')},{"id":"HotspotPanoramaOverlayArea_88F1F6FE_9BEB_B1FC_41D8_32D624046D06","click":"this.openLink(this.translate('LinkBehaviour_87DD7813_97ED_49A6_41D1_B7B7676B75AD.source'), '_blank')","mapColor":"image","class":"HotspotPanoramaOverlayArea","toolTip":trans('HotspotPanoramaOverlayArea_88F1F6FE_9BEB_B1FC_41D8_32D624046D06.toolTip')},{"id":"HotspotPanoramaOverlayArea_8E2316A3_983E_C6E5_41CB_30BB76B8ED08","class":"HotspotPanoramaOverlayArea","click":"if(!this.Container_85BEEB8C_97E5_4EA2_41DC_7073E19FEC87.get('visible')){ this.setComponentVisibility(this.Container_85BEEB8C_97E5_4EA2_41DC_7073E19FEC87, true, 0, this.effect_8C2C89CC_983F_4AA2_41D5_9A1796192CAB, 'showEffect', false) } else { this.setComponentVisibility(this.Container_85BEEB8C_97E5_4EA2_41DC_7073E19FEC87, false, 0, this.effect_8C2C99CC_983F_4AA2_41DB_DB135995CA93, 'hideEffect', false) }","mapColor":"image"}],"contentOpaque":false,"class":"Player","id":"rootPlayer","backgroundPreloadEnabled":true,"height":"100%","mediaActivationMode":"window","paddingLeft":0,"downloadEnabled":false,"paddingTop":0,"desktopMipmappingEnabled":false,"paddingBottom":0,"scripts":{"changeBackgroundWhilePlay":TDV.Tour.Script.changeBackgroundWhilePlay,"changePlayListWithSameSpot":TDV.Tour.Script.changePlayListWithSameSpot,"quizFinish":TDV.Tour.Script.quizFinish,"isPanorama":TDV.Tour.Script.isPanorama,"cloneCamera":TDV.Tour.Script.cloneCamera,"getOverlays":TDV.Tour.Script.getOverlays,"copyObjRecursively":TDV.Tour.Script.copyObjRecursively,"setOverlayBehaviour":TDV.Tour.Script.setOverlayBehaviour,"getPanoramaOverlayByName":TDV.Tour.Script.getPanoramaOverlayByName,"keepCompVisible":TDV.Tour.Script.keepCompVisible,"setStartTimeVideo":TDV.Tour.Script.setStartTimeVideo,"_initItemWithComps":TDV.Tour.Script._initItemWithComps,"resumePlayers":TDV.Tour.Script.resumePlayers,"triggerOverlay":TDV.Tour.Script.triggerOverlay,"executeFunctionWhenChange":TDV.Tour.Script.executeFunctionWhenChange,"setValue":TDV.Tour.Script.setValue,"getPlayListsWithMedia":TDV.Tour.Script.getPlayListsWithMedia,"updateDeepLink":TDV.Tour.Script.updateDeepLink,"loadFromCurrentMediaPlayList":TDV.Tour.Script.loadFromCurrentMediaPlayList,"setStartTimeVideoSync":TDV.Tour.Script.setStartTimeVideoSync,"shareSocial":TDV.Tour.Script.shareSocial,"resumeGlobalAudios":TDV.Tour.Script.resumeGlobalAudios,"stopGlobalAudios":TDV.Tour.Script.stopGlobalAudios,"_getPlayListsWithViewer":TDV.Tour.Script._getPlayListsWithViewer,"stopGlobalAudio":TDV.Tour.Script.stopGlobalAudio,"getPlayListWithItem":TDV.Tour.Script.getPlayListWithItem,"getActiveMediaWithViewer":TDV.Tour.Script.getActiveMediaWithViewer,"updateMediaLabelFromPlayList":TDV.Tour.Script.updateMediaLabelFromPlayList,"getActivePlayerWithViewer":TDV.Tour.Script.getActivePlayerWithViewer,"pauseCurrentPlayers":TDV.Tour.Script.pauseCurrentPlayers,"assignObjRecursively":TDV.Tour.Script.assignObjRecursively,"setCameraSameSpotAsMedia":TDV.Tour.Script.setCameraSameSpotAsMedia,"getFirstPlayListWithMedia":TDV.Tour.Script.getFirstPlayListWithMedia,"showComponentsWhileMouseOver":TDV.Tour.Script.showComponentsWhileMouseOver,"setComponentVisibility":TDV.Tour.Script.setComponentVisibility,"getPlayListItems":TDV.Tour.Script.getPlayListItems,"getCurrentPlayerWithMedia":TDV.Tour.Script.getCurrentPlayerWithMedia,"pauseGlobalAudiosWhilePlayItem":TDV.Tour.Script.pauseGlobalAudiosWhilePlayItem,"getPixels":TDV.Tour.Script.getPixels,"setMapLocation":TDV.Tour.Script.setMapLocation,"getCurrentPlayers":TDV.Tour.Script.getCurrentPlayers,"pauseGlobalAudio":TDV.Tour.Script.pauseGlobalAudio,"init":TDV.Tour.Script.init,"getPlayListItemByMedia":TDV.Tour.Script.getPlayListItemByMedia,"showPopupImage":TDV.Tour.Script.showPopupImage,"setLocale":TDV.Tour.Script.setLocale,"setEndToItemIndex":TDV.Tour.Script.setEndToItemIndex,"getKey":TDV.Tour.Script.getKey,"getGlobalAudio":TDV.Tour.Script.getGlobalAudio,"pauseGlobalAudios":TDV.Tour.Script.pauseGlobalAudios,"getMediaByName":TDV.Tour.Script.getMediaByName,"playAudioList":TDV.Tour.Script.playAudioList,"showPopupMedia":TDV.Tour.Script.showPopupMedia,"quizShowScore":TDV.Tour.Script.quizShowScore,"unregisterKey":TDV.Tour.Script.unregisterKey,"showPopupPanoramaVideoOverlay":TDV.Tour.Script.showPopupPanoramaVideoOverlay,"visibleComponentsIfPlayerFlagEnabled":TDV.Tour.Script.visibleComponentsIfPlayerFlagEnabled,"quizShowTimeout":TDV.Tour.Script.quizShowTimeout,"existsKey":TDV.Tour.Script.existsKey,"getComponentByName":TDV.Tour.Script.getComponentByName,"playGlobalAudioWhilePlay":TDV.Tour.Script.playGlobalAudioWhilePlay,"historyGoBack":TDV.Tour.Script.historyGoBack,"fixTogglePlayPauseButton":TDV.Tour.Script.fixTogglePlayPauseButton,"mixObject":TDV.Tour.Script.mixObject,"setMainMediaByIndex":TDV.Tour.Script.setMainMediaByIndex,"showPopupPanoramaOverlay":TDV.Tour.Script.showPopupPanoramaOverlay,"setMainMediaByName":TDV.Tour.Script.setMainMediaByName,"historyGoForward":TDV.Tour.Script.historyGoForward,"startPanoramaWithCamera":TDV.Tour.Script.startPanoramaWithCamera,"registerKey":TDV.Tour.Script.registerKey,"getMediaFromPlayer":TDV.Tour.Script.getMediaFromPlayer,"updateVideoCues":TDV.Tour.Script.updateVideoCues,"getMediaWidth":TDV.Tour.Script.getMediaWidth,"autotriggerAtStart":TDV.Tour.Script.autotriggerAtStart,"getMediaHeight":TDV.Tour.Script.getMediaHeight,"quizSetItemFound":TDV.Tour.Script.quizSetItemFound,"showWindow":TDV.Tour.Script.showWindow,"quizStart":TDV.Tour.Script.quizStart,"initGA":TDV.Tour.Script.initGA,"stopAndGoCamera":TDV.Tour.Script.stopAndGoCamera,"openLink":TDV.Tour.Script.openLink,"initQuiz":TDV.Tour.Script.initQuiz,"setMediaBehaviour":TDV.Tour.Script.setMediaBehaviour,"quizShowQuestion":TDV.Tour.Script.quizShowQuestion,"translate":TDV.Tour.Script.translate,"playGlobalAudio":TDV.Tour.Script.playGlobalAudio,"syncPlaylists":TDV.Tour.Script.syncPlaylists,"setPanoramaCameraWithCurrentSpot":TDV.Tour.Script.setPanoramaCameraWithCurrentSpot,"setPanoramaCameraWithSpot":TDV.Tour.Script.setPanoramaCameraWithSpot,"isCardboardViewMode":TDV.Tour.Script.isCardboardViewMode},"mouseWheelEnabled":true,"toolTipHorizontalAlign":"center","scrollBarColor":"#000000","children":["this.MainViewer","this.Container_85BEEB8C_97E5_4EA2_41DC_7073E19FEC87"],"mobileMipmappingEnabled":false,"verticalAlign":"top","vrPolyfillScale":0.5,"layout":"absolute","gap":10,"data":{"name":"Player468","locales":{"en":"locale/en.txt"},"defaultLocale":"en"}};
    if (d['data'] == undefined)
        d['data'] = {};
    d['data']['translateObjs'] = c;
    d['data']['history'] = {};
    d['scripts']['createQuizConfig'] = createQuizConfig;
    TDV['PlayerAPI']['defineScript'](d);
}());
//# sourceMappingURL=http://localhost:9000/script_device_v2020.3.16.js.map
//Generated with v2020.3.16, Wed Sep 16 2020