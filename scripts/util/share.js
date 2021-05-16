Kakao.init('93d73903be56c4b0c36e18df62621610');

class Sharer {
    constructor(name, url) {
        this.name = name;
        this.url = url;

        this.snsUrl = {
            twitter: `https://twitter.com/intent/tweet?text=${name}:&url=`,
            facebook: 'http://www.facebook.com/sharer/sharer.php?u=',
            kakaostory: 'https://story.kakao.com/share?url='
        }
    }
    
    share(sns) {
        if (sns === 'kakaotalk') {
            this.shareKakaotalk();
        }
        else if (sns in this.snsUrl) {
            this.shareOthers(this.snsUrl[sns]);
        }
        else {
            console.log('Not supported SNS: ' + sns);
        }
    }

    shareKakaotalk(e) {
        const protocol = window.location.protocol;
        const host = window.location.host;
        const url = protocol + '//' + host;
        
        Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
                title: '선물 추천 테스트',
                description: '소중한 사람에게 보낼 선물을 추천해드립니다!',
                imageUrl: url + '/images/thumbnail.png',
                link: {
                    webUrl: this.url,
                    mobileWebUrl: this.url,
                }
            }
        });
    }

    shareOthers(sns) {
        window.open(sns + this.url, '', 'width=600,height=400,top=100,left=100,scrollbars=yes');
    }
}

export default {
    Sharer,
};