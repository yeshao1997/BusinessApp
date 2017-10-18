/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2017/10/5 21:52:14                           */
/*==============================================================*/


drop table if exists FASALBUM;

drop table if exists FASCLOTH;

drop table if exists FASCOLLECT;

drop table if exists FASCOMMENT;

drop table if exists FASCOMPONENT;

drop table if exists FASCOSTUME;

drop table if exists FASDESIGNWORK;

drop table if exists FASDICTCATE;

drop table if exists FASDICTDATA;

drop table if exists FASFLLOW;

drop table if exists FASINFORMATION;

drop table if exists FASPURCHASE;

drop table if exists FASTYPE;

drop table if exists FASUSERACCOUNT;

drop table if exists FASUSERDATA;

drop table if exists FASWEAVE;

/*==============================================================*/
/* Table: FASALBUM                                              */
/*==============================================================*/
create table FASALBUM
(
   album_id             varchar(50) not null,
   user_id              varchar(50),
   album_name           varchar(50),
   album_picture        varchar(200),
   album_time           varchar(50),
   primary key (album_id)
);

/*==============================================================*/
/* Table: FASCLOTH                                              */
/*==============================================================*/
create table FASCLOTH
(
   cloth_id             varchar(50) not null,
   cloth_name           varchar(50),
   cloth_supplier       varchar(50),
   cloth_price          int,
   cloth_no             varchar(50),
   cloth_moq            int,
   component_id         int,
   purpose_id           int,
   weave_id             int,
   make_id              int,
   cloth_picture1       varchar(200),
   cloth_picture2       varchar(200),
   cloth_picture3       varchar(200),
   cloth_picture        varchar(200),
   cloth_elastic        int,
   cloth_tcx            varchar(50),
   cloth_tpx            varchar(50),
   cloth_fabulous       int,
   cloth_reltime        varchar(50),
   cloth_status         int,
   primary key (cloth_id)
);

/*==============================================================*/
/* Table: FASCOLLECT                                            */
/*==============================================================*/
create table FASCOLLECT
(
   collect_id           varchar(50) not null,
   collection_id        varchar(50),
   collector_id         varchar(50),
   collect_type         int,
   collect_time         varchar(50),
   primary key (collect_id)
);

/*==============================================================*/
/* Table: FASCOMMENT                                            */
/*==============================================================*/
create table FASCOMMENT
(
   comment_id           varchar(50) not null,
   commentary_id        varchar(50),
   comment_content      varchar(500),
   commentator_id       varchar(50),
   comment_fabulous     int,
   comment_reltime      varchar(50),
   primary key (comment_id)
);

/*==============================================================*/
/* Table: FASCOMPONENT                                          */
/*==============================================================*/
create table FASCOMPONENT
(
   component_id         int not null,
   component_number     int,
   component_supcategory varchar(50),
   component_name       varchar(50),
   primary key (component_id)
);

/*==============================================================*/
/* Table: FASCOSTUME                                            */
/*==============================================================*/
create table FASCOSTUME
(
   costume_id           varchar(50) not null,
   costume_name         varchar(50),
   costume_no           varchar(50),
   costume_intro        varchar(200),
   type_id              int,
   model_id             int,
   style_id             int,
   component_id         int,
   weave_id             int,
   costume_color        varchar(50),
   costume_age          varchar(50),
   costume_season       varchar(50),
   costume_picture1     varchar(200),
   costume_picture2     varchar(200),
   costume_picture3     varchar(200),
   costume_picture4     varchar(200),
   costume_fabulous     int,
   costume_reltime      varchar(50),
   costume_status       int,
   primary key (costume_id)
);

/*==============================================================*/
/* Table: FASDESIGNWORK                                         */
/*==============================================================*/
create table FASDESIGNWORK
(
   work_id              varchar(50) not null,
   designer_id          varchar(50),
   work_name            varchar(50),
   type_id              int,
   style_id             int,
   album_id             varchar(50),
   fabric_id            int,
   model_id             int,
   work_color           varchar(50),
   work_intro           varchar(200),
   work_picture1        varchar(200),
   work_picture2        varchar(200),
   work_picture3        varchar(200),
   work_picture4        varchar(200),
   work_picture5        varchar(200),
   work_picture6        varchar(200),
   work_reltime         varchar(50),
   worl_fabulous        int,
   work_status          int,
   primary key (work_id)
);

/*==============================================================*/
/* Table: FASDICTCATE                                           */
/*==============================================================*/
create table FASDICTCATE
(
   dictionarycategory_id int not null,
   dictionarycategory_number int,
   dictionarycategory_name varchar(50),
   primary key (dictionarycategory_id)
);

/*==============================================================*/
/* Table: FASDICTDATA                                           */
/*==============================================================*/
create table FASDICTDATA
(
   dactionarydata_id    int not null,
   dictionarycategory_number int,
   dictionarydata_number int,
   dictionarydata_value varchar(50),
   primary key (dactionarydata_id)
);

/*==============================================================*/
/* Table: FASFLLOW                                              */
/*==============================================================*/
create table FASFLLOW
(
   follow_id            varchar(50) not null,
   follower_id          varchar(50),
   concern_id           varchar(50),
   follow_time          varchar(50),
   primary key (follow_id)
);

/*==============================================================*/
/* Table: FASINFORMATION                                        */
/*==============================================================*/
create table FASINFORMATION
(
   information_id       varchar(50) not null,
   information_topic    varchar(50),
   information_author   varchar(50),
   information_content  varchar(2000),
   information_fabulous int,
   information_reltime  varchar(50),
   information_status   int,
   primary key (information_id)
);

/*==============================================================*/
/* Table: FASPURCHASE                                           */
/*==============================================================*/
create table FASPURCHASE
(
   purchase_id          varchar(50) not null,
   buyer_id             varchar(50),
   work_id              varchar(50),
   seller_id            varchar(50),
   purchase_request     varchar(500),
   purchase_name        varchar(50),
   purchase_phone       varchar(50),
   purchase_time        varchar(50),
   purchase_status      int,
   primary key (purchase_id)
);

/*==============================================================*/
/* Table: FASTYPE                                               */
/*==============================================================*/
create table FASTYPE
(
   type_id              int not null,
   type_number          int,
   type_supcategpry     varchar(50),
   type_name            varchar(50),
   primary key (type_id)
);

/*==============================================================*/
/* Table: FASUSERACCOUNT                                        */
/*==============================================================*/
create table FASUSERACCOUNT
(
   userid               varchar(50) not null,
   user_account         varchar(50),
   user_password        varchar(50),
   user_type            int,
   user_regtime         varchar(50),
   user_status          varchar(50),
   primary key (userid)
);

/*==============================================================*/
/* Table: FASUSERDATA                                           */
/*==============================================================*/
create table FASUSERDATA
(
   data_id              varchar(50) not null,
   user_id              varchar(50),
   data_portrait        varchar(200),
   data_mail            varchar(200),
   data_phone           varchar(50),
   designtype_id        int,
   primary key (data_id)
);

/*==============================================================*/
/* Table: FASWEAVE                                              */
/*==============================================================*/
create table FASWEAVE
(
   weave_id             int not null,
   weave_number         int,
   weave_supcategory    varchar(50),
   weave_name           varchar(50),
   primary key (weave_id)
);

