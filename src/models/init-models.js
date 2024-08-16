import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _binh_luan from  "./binh_luan.js";
import _hinh_anh from  "./hinh_anh.js";
import _hinh_anh_tag from  "./hinh_anh_tag.js";
import _luu_anh from  "./luu_anh.js";
import _nguoi_dung from  "./nguoi_dung.js";
import _tag from  "./tag.js";

export default function initModels(sequelize) {
  const binh_luan = _binh_luan.init(sequelize, DataTypes);
  const hinh_anh = _hinh_anh.init(sequelize, DataTypes);
  const hinh_anh_tag = _hinh_anh_tag.init(sequelize, DataTypes);
  const luu_anh = _luu_anh.init(sequelize, DataTypes);
  const nguoi_dung = _nguoi_dung.init(sequelize, DataTypes);
  const tag = _tag.init(sequelize, DataTypes);

  hinh_anh.belongsToMany(nguoi_dung, { as: 'nguoi_dung_id_nguoi_dungs', through: luu_anh, foreignKey: "hinh_id", otherKey: "nguoi_dung_id" });
  hinh_anh.belongsToMany(tag, { as: 'tag_id_tags', through: hinh_anh_tag, foreignKey: "hinh_id", otherKey: "tag_id" });
  nguoi_dung.belongsToMany(hinh_anh, { as: 'hinh_id_hinh_anh_luu_anhs', through: luu_anh, foreignKey: "nguoi_dung_id", otherKey: "hinh_id" });
  tag.belongsToMany(hinh_anh, { as: 'hinh_id_hinh_anhs', through: hinh_anh_tag, foreignKey: "tag_id", otherKey: "hinh_id" });
  binh_luan.belongsTo(hinh_anh, { as: "hinh", foreignKey: "hinh_id"});
  hinh_anh.hasMany(binh_luan, { as: "binh_luans", foreignKey: "hinh_id"});
  hinh_anh_tag.belongsTo(hinh_anh, { as: "hinh", foreignKey: "hinh_id"});
  hinh_anh.hasMany(hinh_anh_tag, { as: "hinh_anh_tags", foreignKey: "hinh_id"});
  luu_anh.belongsTo(hinh_anh, { as: "hinh", foreignKey: "hinh_id"});
  hinh_anh.hasMany(luu_anh, { as: "luu_anhs", foreignKey: "hinh_id"});
  binh_luan.belongsTo(nguoi_dung, { as: "nguoi_dung", foreignKey: "nguoi_dung_id"});
  nguoi_dung.hasMany(binh_luan, { as: "binh_luans", foreignKey: "nguoi_dung_id"});
  hinh_anh.belongsTo(nguoi_dung, { as: "nguoi_dung", foreignKey: "nguoi_dung_id"});
  nguoi_dung.hasMany(hinh_anh, { as: "hinh_anhs", foreignKey: "nguoi_dung_id"});
  luu_anh.belongsTo(nguoi_dung, { as: "nguoi_dung", foreignKey: "nguoi_dung_id"});
  nguoi_dung.hasMany(luu_anh, { as: "luu_anhs", foreignKey: "nguoi_dung_id"});
  hinh_anh_tag.belongsTo(tag, { as: "tag", foreignKey: "tag_id"});
  tag.hasMany(hinh_anh_tag, { as: "hinh_anh_tags", foreignKey: "tag_id"});

  return {
    binh_luan,
    hinh_anh,
    hinh_anh_tag,
    luu_anh,
    nguoi_dung,
    tag,
  };
}
