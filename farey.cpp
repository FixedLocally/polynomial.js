#include <iostream>
#include <cstdio>
#include <sstream>
#include <cmath>
using namespace std;

int main(int argc, char** argv){
    int a=0;
    int b=1;
    int c=1;
    int d=1;
    int e=0;
    int f=0;
    if(argc<2){
        printf("%s decimal\n",argv[0]);
        return 1;
    }
    stringstream k(argv[1]);
    int N=100000;
    if(argc>2){
        stringstream m(argv[2]);
        m >> N;
    }
    double x,mid;
    k >> x;
    f=x<0;
    //printf("%.9f %d",x,f);
    x=abs(x);
    //printf("scale=10\n");
    e=x;
    x-=e;
    while(b<=N && d<=N){
        mid=(double)(a+c)/(double)(b+d);
        if(x<=mid+0.0000000005 && x>=mid-0.0000000005){
            if(b+d<=N) a+=c; b+=d; break; //printf("%d %d/%d\n",e,a+c,b+d); return 0;
            if(d>b) b=N+1; break; //printf("%d %d/%d\n",e,c,d); break; return 0;
            break; //printf("%d %d/%d\n",e,a,b); return 0;
        }else{
            if(x>mid){
                a+=c;
                b+=d;
            }else{
                c+=a;
                d+=b;
            }
        }
    }
    //printf("f=%d,e=%d,d=%d,c=%d,b=%d,a=%d\n",f,e,d,c,b,a);
    if(f){
        printf("-");
    }
    if(b>N){
        if(e){
            printf("%d %d/%d\n",e,c,d);
        }else{
            printf("%d/%d\n",c,d);
        }
    }else{
        if(e){
            printf("%d %d/%d\n",e,a,b);
        }else{
            printf("%d/%d\n",a,b);
        }
    }
    return 0;
}
